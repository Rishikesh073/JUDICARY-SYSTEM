import json
import chromadb
from chromadb.utils import embedding_functions

def populate_vector_db(json_file):
    print("Initializing persistent local ChromaDB...")
    # This creates a local folder to save the DB permanently so you don't have to re-embed on restart
    chroma_client = chromadb.PersistentClient(path="./chroma_db")

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

    for index, case in enumerate(cases, 1):
        text = case['content']
        # Chunk the massive legal documents into 2000-character blocks for precise retrieval
        chunk_size = 2000
        chunks = [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]

        for chunk_idx, chunk in enumerate(chunks):
            documents.append(chunk)
            
            # The LLM will use this metadata to cite its sources accurately
            metadatas.append({
                "filename": case['filename'],
                "year": case.get('year', '2025'),
                "source_link": case.get('cloudinary_url', 'URL_NOT_FOUND')
            })
            ids.append(f"{case['filename']}_chunk_{chunk_idx}")

    # Add to ChromaDB in batches to prevent memory overload
    batch_size = 150
    for i in range(0, len(documents), batch_size):
        collection.add(
            documents=documents[i:i+batch_size],
            metadatas=metadatas[i:i+batch_size],
            ids=ids[i:i+batch_size]
        )
        print(f"💾 Vectorized batch {i} to {i + len(documents[i:i+batch_size])}...")

    print("\n🚀 Vector Database fully populated and ready for queries!")

populate_vector_db('extracted_cases_with_urls.json')