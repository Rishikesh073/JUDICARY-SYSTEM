import os
import chromadb
from chromadb.utils import embedding_functions
from langchain_ollama import OllamaLLM

# 1. Connect to the local vector database we built in Phase 1
db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "chroma_db")
chroma_client = chromadb.PersistentClient(path=db_path)
sentence_transformer_ef = embedding_functions.DefaultEmbeddingFunction()
collection = chroma_client.get_collection(
    name="lexagent_precedents", 
    embedding_function=sentence_transformer_ef
)

# 2. Connect to local Ollama (Optimized for speed with llama3.2 3B model)
llm = OllamaLLM(model="llama3.2")

def run_research_agent(query: str):
    print(f"🕵️ Fast-scanning vector database for: '{query}'")
    
    # Retrieve top 3 most relevant chunks (reduced from 5 for faster context processing)
    results = collection.query(
        query_texts=[query],
        n_results=3
    )

    # Format the retrieved context so the LLM can understand it
    context_text = ""
    for i in range(len(results['documents'][0])):
        doc = results['documents'][0][i]
        meta = results['metadatas'][0][i]
        context_text += f"\n--- Precedent {i+1}: {meta['filename']} (Year: {meta['year']}) ---\n"
        context_text += f"Excerpt: {doc}\n"
        context_text += f"Source Link: {meta['source_link']}\n"

    print("🧠 Context retrieved. Synthesizing legal memo via Ollama...")

    # The Prompt: Condensed for faster inference
    prompt = f"""You are LexAgent, an elite legal clerk. Write a structured memo for the query: "{query}"
    Use ONLY the precedent below. Cite exact filenames and Cloudinary links.
    
    PRECEDENT:
    {context_text}

    FORMAT:
    ## 1. Executive Summary
    ## 2. Key Holdings & Analysis
    ## 3. Verified Citations
    """

    # Generate the memo
    response = llm.invoke(prompt)
    return response