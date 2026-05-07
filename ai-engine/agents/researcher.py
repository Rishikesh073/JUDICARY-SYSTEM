import chromadb
from chromadb.utils import embedding_functions
from agents.state import AgentState

# Connect to ChromaDB
chroma_client = chromadb.PersistentClient(path="./chroma_db")
sentence_transformer_ef = embedding_functions.DefaultEmbeddingFunction()
collection = chroma_client.get_collection(
    name="lexagent_precedents", 
    embedding_function=sentence_transformer_ef
)

def researcher_agent(state: AgentState):
    parsed = state['parsed_query']
    search_query = " ".join(parsed.get('keywords', [state['query']]))
    
    print(f"[Agent: Researcher] Scanning DB for: {search_query}")
    
    # Perform semantic search
    results = collection.query(
        query_texts=[search_query],
        n_results=10 # Get more cases than before for the Critic to filter
    )
    
    cases = []
    for i in range(len(results['documents'][0])):
        cases.append({
            "content": results['documents'][0][i],
            "metadata": results['metadatas'][0][i],
            "score": results['distances'][0][i] if 'distances' in results else 0
        })

    return {
        "retrieved_cases": cases,
        "logs": [f"Researcher: Found {len(cases)} relevant cases in the vault."]
    }
