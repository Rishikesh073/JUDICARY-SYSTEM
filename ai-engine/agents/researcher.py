import os
import json
import chromadb
from chromadb.utils import embedding_functions
from langchain_ollama import OllamaLLM

def run_researcher(query: str):
    print(f"[Researcher] Scanning vector database for: '{query}'", flush=True)
    
    # 1. Extract filters from query using LLM
    llm = OllamaLLM(model="llama3.2")
    filter_prompt = f"""You are a legal metadata extractor. Extract ChromaDB filters from the query.
    Query: "{query}"
    
    Keys: "act", "year", "court".
    - act: "PMLA", "IPC", "BNS", etc.
    - year: The year as a string.
    - court: "Supreme Court of India" or "High Court".
    
    Return ONLY a JSON object. Example: {{"act": "PMLA", "year": "2024"}}
    If no filters, return {{}}.
    """
    
    metadata_filters = {}
    try:
        raw_filters = llm.invoke(filter_prompt).strip()
        if "```json" in raw_filters:
            raw_filters = raw_filters.split("```json")[1].split("```")[0].strip()
        elif "```" in raw_filters:
            raw_filters = raw_filters.split("```")[1].strip()
        metadata_filters = json.loads(raw_filters)
        print(f"[Researcher] Applying filters: {metadata_filters}", flush=True)
    except Exception as e:
        print(f"[Researcher] Filter extraction failed: {e}", flush=True)

    db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "chroma_db")
    chroma_client = chromadb.PersistentClient(path=db_path)
    sentence_transformer_ef = embedding_functions.DefaultEmbeddingFunction()
    collection = chroma_client.get_collection(
        name="lexagent_precedents", 
        embedding_function=sentence_transformer_ef
    )
    
    # Apply filters if any
    query_args = {
        "query_texts": [query],
        "n_results": 3
    }
    if metadata_filters:
        if len(metadata_filters) == 1:
            query_args["where"] = metadata_filters
        elif len(metadata_filters) > 1:
            query_args["where"] = {
                "$and": [{k: v} for k, v in metadata_filters.items()]
            }

    results = collection.query(**query_args)

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
