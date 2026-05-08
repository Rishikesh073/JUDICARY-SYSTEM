import json
import os
import chromadb
from chromadb.utils import embedding_functions

def populate_vector_db(json_file):
    print("Initializing persistent local ChromaDB...")
    # This creates a local folder to save the DB permanently so you don't have to re-embed on restart
    db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "chroma_db")
    chroma_client = chromadb.PersistentClient(path=db_path)

    # Chroma's default embedding model runs locally and is incredibly fast
    sentence_transformer_ef = embedding_functions.DefaultEmbeddingFunction()

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

    import re

    def legal_chunker(text):
        # Look for common legal section headers and paragraph markers
        boundaries = [r"Held:", r"Ratio Decidendi:", r"Obiter Dicta:", r"Obiter:", r"Per Curiam:", r"\n\d+\.", r"\n\(\d+\)"]
        pattern = "(?i)(" + "|".join(boundaries) + ")"
        parts = re.split(pattern, text)
        chunks = []
        current_chunk = ""
        for part in parts:
            if not part:
                continue
            # If this part is a boundary header, start a new chunk
            if re.match(pattern, part):
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
        text = case['content']
        chunks = legal_chunker(text)

        # Base metadata for the case (normalize keys used by downstream filters)
        # Try to pull explicit fields from the case dict first
        case_number = case.get('case_number') or case.get('case_no') or case.get('caseNo') or case.get('caseId') or case.get('caseno')
        # Year fallback
        year = str(case.get('year', '2025'))
        # Source link
        source_link = case.get('cloudinary_url') or case.get('source_link') or case.get('url') or 'URL_NOT_FOUND'

        # Normalize court: prefer explicit field, else detect from text
        raw_court = case.get('court')
        if raw_court:
            court = raw_court
        else:
            if re.search(r'(?i)supreme court', text[:5000]):
                court = 'Supreme Court of India'
            elif re.search(r'(?i)high court', text[:5000]):
                # try to capture which High Court if present
                m = re.search(r'([A-Z][a-z]+ High Court)', text[:2000])
                court = m.group(1) if m else 'High Court'
            else:
                court = 'Unknown'

        # Try to extract a judgment date from explicit fields or the top of the text
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

        # Detect Act (prefer explicit field)
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
            
            # Combine case metadata with chunk-specific info
            chunk_meta = case_meta.copy()
            chunk_meta["section_type"] = get_section_type(chunk)
            # Ensure keys used by researcher filters exist on every chunk
            chunk_meta.setdefault('case_number', case_meta.get('case_number', 'Unknown'))
            chunk_meta.setdefault('date_of_judgment', case_meta.get('date_of_judgment', 'Unknown'))
            chunk_meta.setdefault('act', case_meta.get('act', 'General'))

            metadatas.append(chunk_meta)
            ids.append(f"{case.get('filename','unknown')}_chunk_{chunk_idx}")

    # Add to ChromaDB in batches to prevent memory overload
    batch_size = 150
    for i in range(0, len(documents), batch_size):
        collection.add(
            documents=documents[i:i+batch_size],
            metadatas=metadatas[i:i+batch_size],
            ids=ids[i:i+batch_size]
        )
        print(f"Vectorized batch {i} to {i + len(documents[i:i+batch_size])}...")

    print("\nVector Database fully populated and ready for queries!")

populate_vector_db('extracted_cases_with_urls.json')