import json
import os
import chromadb
from chromadb.utils import embedding_functions
import re

def populate_vector_db(json_file):
    print("Initializing persistent local ChromaDB...")
    db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "chroma_db")
    chroma_client = chromadb.PersistentClient(path=db_path)
    sentence_transformer_ef = embedding_functions.DefaultEmbeddingFunction()

    try:
        chroma_client.delete_collection(name="lexagent_precedents")
    except Exception:
        pass

    collection = chroma_client.get_or_create_collection(
        name="lexagent_precedents",
        embedding_function=sentence_transformer_ef
    )

    with open(json_file, 'r', encoding='utf-8') as f:
        cases = json.load(f)

    documents = []
    metadatas = []
    ids = []

    print(f"Chunking {len(cases)} cases for vectorization. This will take a few minutes...")

    def legal_chunker(text):
        boundaries = [r"Held:", r"Ratio Decidendi:", r"Obiter Dicta:", r"Obiter:", r"Per Curiam:", r"\n\d+\.", r"\n\(\d+\)"]
        pattern = "(" + "|".join(boundaries) + ")"
        parts = re.split(pattern, text, flags=re.IGNORECASE)
        chunks = []
        current_chunk = ""
        for part in parts:
            if not part:
                continue
            if re.match(pattern, part, flags=re.IGNORECASE):
                if current_chunk:
                    chunks.append(current_chunk.strip())
                current_chunk = part
            else:
                current_chunk += part
        if current_chunk:
            chunks.append(current_chunk.strip())
        return [c for c in chunks if len(c) > 50]

    def get_section_type(chunk):
        if re.search(r'(?i)\bHeld:\b', chunk):
            return "holding"
        if re.search(r'(?i)\bRatio Decidendi:\b', chunk) or re.search(r'(?i)\bRatio:\b', chunk):
            return "ratio"
        if re.search(r'(?i)\bObiter Dicta:\b', chunk) or re.search(r'(?i)\bObiter:\b', chunk):
            return "obiter"
        if re.search(r'(?i)\bPer Curiam:\b', chunk):
            return "per_curiam"
        if re.match(r'^\s*\d+\.', chunk):
            return "paragraph"
        return "general"

    for index, case in enumerate(cases, 1):
        if index % 100 == 0:
            print(f"   ⚙️  [Chunking] {index}/{len(cases)} cases processed...")
            
        text = case['content']
        chunks = legal_chunker(text)

        case_number = case.get('case_number') or case.get('case_no') or case.get('caseNo') or case.get('caseId') or case.get('caseno')
        try:
            year = int(case.get('year', 2025))
        except Exception:
            year = 2025
        source_link = case.get('cloudinary_url') or case.get('source_link') or case.get('url') or 'URL_NOT_FOUND'

        raw_court = case.get('court')
        if raw_court:
            court = raw_court
        else:
            if re.search(r'(?i)supreme court', text[:5000]):
                court = 'Supreme Court of India'
            elif re.search(r'(?i)high court', text[:5000]):
                m = re.search(r'([A-Z][a-z]+ High Court)', text[:2000])
                court = m.group(1) if m else 'High Court'
            else:
                court = 'Unknown'

        date_of_judgment = case.get('date') or case.get('judgment_date') or case.get('date_of_judgment') or case.get('judgmentDate')
        if not date_of_judgment:
            header = text[:1200]
            months = r'January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec'
            m = re.search(r'\b\d{1,2}\s+(?:' + months + r')\s+\d{4}\b', header, re.I)
            if not m:
                m = re.search(r'\b\d{4}-\d{2}-\d{2}\b', header)
            if not m:
                m = re.search(r'\b\d{1,2}/\d{1,2}/\d{2,4}\b', header)
            date_of_judgment = m.group(0) if m else 'Unknown'

        case_meta = {
            "filename": case.get('filename', 'unknown'),
            "case_number": case_number or 'Unknown',
            "year": year,
            "date_of_judgment": date_of_judgment,
            "source_link": source_link,
            "court": court,
            "jurisdiction": case.get('jurisdiction', 'India')
        }

        if case.get('act'):
            case_meta['act'] = case.get('act')
        else:
            if re.search(r'\bPMLA\b|Money Laundering', text, re.I):
                case_meta["act"] = "PMLA"
            elif re.search(r'\bIPC\b', text):
                case_meta["act"] = "IPC"
            elif re.search(r'\bBNS\b', text):
                case_meta["act"] = "BNS"
            else:
                case_meta["act"] = "General"

        for chunk_idx, chunk in enumerate(chunks):
            documents.append(chunk)
            chunk_meta = case_meta.copy()
            chunk_meta["section_type"] = get_section_type(chunk)
            metadatas.append(chunk_meta)
            ids.append(f"{case.get('filename','unknown')}_chunk_{chunk_idx}")

    batch_size = 150
    for i in range(0, len(documents), batch_size):
        collection.add(
            documents=documents[i:i+batch_size],
            metadatas=metadatas[i:i+batch_size],
            ids=ids[i:i+batch_size]
        )
        print(f"Vectorized batch {i} to {i + len(documents[i:i+batch_size])}...")

    print("\nVector Database fully populated and ready for queries!")

if __name__ == "__main__":
    # Use the master dataset which includes 1950-2025
    master_file = 'master_judicial_dataset.json'
    
    if not os.path.exists(master_file):
        print(f"⚠️  {master_file} not found. Falling back to pilot data...")
        master_file = 'extracted_cases_with_urls.json'
        
    populate_vector_db(master_file)