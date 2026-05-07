import chromadb
from chromadb.utils import embedding_functions

def run_researcher(query: str):
    print(f"[Researcher] Scanning vector database for: '{query}'")
    chroma_client = chromadb.PersistentClient(path="./chroma_db")
    sentence_transformer_ef = embedding_functions.DefaultEmbeddingFunction()
    collection = chroma_client.get_collection(
        name="lexagent_precedents", 
        embedding_function=sentence_transformer_ef
    )
    
    results = collection.query(
        query_texts=[query],
        n_results=3
    )

    cases = []
    if results['documents'] and len(results['documents']) > 0:
        for i in range(len(results['documents'][0])):
            doc = results['documents'][0][i]
            meta = results['metadatas'][0][i]
            cases.append({
                "id": i + 1,
                "filename": meta.get('filename', 'Unknown'),
                "year": meta.get('year', 'Unknown'),
                "source_link": meta.get('source_link', '#'),
                "content": doc
            })
    return cases
