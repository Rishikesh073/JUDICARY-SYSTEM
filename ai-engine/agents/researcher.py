import os
import json
import re
import chromadb
from chromadb.utils import embedding_functions
from langchain_ollama import OllamaLLM


def _normalize_court(value):
    if not value:
        return None
    court = str(value).strip()
    if re.search(r'(?i)supreme\s+court', court):
        return "Supreme Court of India"
    if re.search(r'(?i)high\s+court', court):
        return "High Court"
    return court


def _parse_year_constraint(value):
    if value is None:
        return None

    if isinstance(value, int):
        return {"$eq": value}

    if isinstance(value, str):
        text = value.strip()
        if re.fullmatch(r"\d{4}", text):
            return {"$eq": int(text)}

        after_match = re.search(r"(?i)after\s+(\d{4})", text)
        if after_match:
            return {"$gte": int(after_match.group(1)) + 1}

        since_match = re.search(r"(?i)(?:since|from)\s+(\d{4})", text)
        if since_match:
            return {"$gte": int(since_match.group(1))}

        before_match = re.search(r"(?i)before\s+(\d{4})", text)
        if before_match:
            return {"$lte": int(before_match.group(1)) - 1}

        between_match = re.search(r"(?i)between\s+(\d{4})\s+and\s+(\d{4})", text)
        if between_match:
            start_year = int(between_match.group(1))
            end_year = int(between_match.group(2))
            return {"$gte": start_year, "$lte": end_year}

    return None


def _build_where_clause(metadata_filters):
    clauses = []

    act = metadata_filters.get("act")
    if act:
        normalized_act = str(act).strip().upper()
        if normalized_act in {"PMLA", "IPC", "BNS"}:
            clauses.append({"act": {"$eq": normalized_act}})
        else:
            clauses.append({"act": {"$eq": str(act).strip()}})

    court = _normalize_court(metadata_filters.get("court"))
    if court:
        clauses.append({"court": {"$eq": court}})

    year_filter = _parse_year_constraint(metadata_filters.get("year") or metadata_filters.get("date"))
    if year_filter:
        clauses.append({"year": year_filter})

    if not clauses:
        return None
    if len(clauses) == 1:
        return clauses[0]
    return {"$and": clauses}


def _extract_filters_from_query(query):
    filters = {}
    query_lower = query.lower()

    if "pmla" in query_lower or "money laundering" in query_lower:
        filters["act"] = "PMLA"
    elif "ipc" in query_lower:
        filters["act"] = "IPC"
    elif "bns" in query_lower:
        filters["act"] = "BNS"

    if re.search(r"(?i)supreme\s+court", query):
        filters["court"] = "Supreme Court of India"
    elif re.search(r"(?i)high\s+court", query):
        filters["court"] = "High Court"

    year_match = re.search(r"(?i)(after|since|from|before|between)?\s*(\d{4})(?:\s*(?:and|to)\s*(\d{4}))?", query)
    if year_match:
        qualifier = (year_match.group(1) or "").lower()
        first_year = year_match.group(2)
        second_year = year_match.group(3)
        if qualifier == "after":
            filters["year"] = f"after {first_year}"
        elif qualifier in {"since", "from"}:
            filters["year"] = f"from {first_year}"
        elif qualifier == "before":
            filters["year"] = f"before {first_year}"
        elif qualifier == "between" and second_year:
            filters["year"] = f"between {first_year} and {second_year}"
        elif first_year:
            filters["year"] = first_year

    return filters

def extract_metadata(query: str):
    """Phase 1: Intent Agent - Extract filters from query."""
    metadata_filters = _extract_filters_from_query(query)
    
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
    
    try:
        raw_filters = llm.invoke(filter_prompt).strip()
        if "```json" in raw_filters:
            raw_filters = raw_filters.split("```json")[1].split("```")[0].strip()
        elif "```" in raw_filters:
            raw_filters = raw_filters.split("```")[1].strip()
        llm_filters = json.loads(raw_filters)
        metadata_filters.update({k: v for k, v in llm_filters.items() if v and k not in metadata_filters})
    except Exception as e:
        print(f"[Researcher] Filter extraction failed: {e}", flush=True)
        
    return metadata_filters

def query_collection(query: str, metadata_filters: dict):
    """Phase 2: Research Agent - Scan vector database."""
    where_clause = _build_where_clause(metadata_filters)
    db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "chroma_db")
    chroma_client = chromadb.PersistentClient(path=db_path)
    sentence_transformer_ef = embedding_functions.DefaultEmbeddingFunction()
    collection = chroma_client.get_collection(
        name="lexagent_precedents", 
        embedding_function=sentence_transformer_ef
    )
    
    query_args = {
        "query_texts": [query],
        "n_results": 10
    }
    if where_clause:
        query_args["where"] = where_clause

    try:
        results = collection.query(**query_args)
    except Exception as e:
        results = collection.query(query_texts=[query], n_results=10)
        
    return results

def format_results(results, metadata_filters):
    """Phase 2 (cont): Research Agent - Filter and format results."""
    cases = []
    if results['documents'] and len(results['documents']) > 0:
        for i in range(len(results['documents'][0])):
            doc = results['documents'][0][i]
            meta = results['metadatas'][0][i]

            # Year Agent Logic
            year_filter = metadata_filters.get("year")
            if isinstance(year_filter, str):
                lower_match = re.search(r"(?i)after\s+(\d{4})", year_filter)
                if lower_match:
                    try:
                        if int(meta.get("year", 0)) < int(lower_match.group(1)) + 1:
                            continue
                    except Exception:
                        pass

            cases.append({
                "id": i + 1,
                "filename": meta.get('filename', 'Unknown'),
                "year": meta.get('year', 'Unknown'),
                "source_link": meta.get('source_link', '#'),
                "content": doc
            })
    return cases

def run_researcher(query: str):
    """Legacy wrapper for backward compatibility."""
    metadata = extract_metadata(query)
    results = query_collection(query, metadata)
    return format_results(results, metadata)

def get_collection_stats():
    db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "chroma_db")
    chroma_client = chromadb.PersistentClient(path=db_path)
    try:
        collection = chroma_client.get_collection(name="lexagent_precedents")
        return {"total_precedents": collection.count()}
    except Exception as e:
        print(f"[Researcher] Stats error: {e}", flush=True)
        return {"total_precedents": 0}
