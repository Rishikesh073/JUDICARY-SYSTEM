import chromadb
import os
from chromadb.utils import embedding_functions

db_path = "/Users/omchauhan/rishijudicary/JUDICARY-SYSTEM/ai-engine/chroma_db"
chroma_client = chromadb.PersistentClient(path=db_path)
sentence_transformer_ef = embedding_functions.DefaultEmbeddingFunction()

print("Collections:", chroma_client.list_collections())

try:
    collection = chroma_client.get_collection(
        name="lexagent_precedents", 
        embedding_function=sentence_transformer_ef
    )
    print("Item count:", collection.count())
    print("Sample metadata:", collection.peek(1)['metadatas'])
except Exception as e:
    print("Error:", e)
