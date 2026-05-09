import json
import asyncio
import os
import chromadb
from datetime import datetime
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agents.researcher import run_researcher, get_collection_stats, extract_metadata, query_collection, format_results, _build_where_clause
from agents.summarizer import run_summarizer
from agents.critic import run_critic

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

HISTORY_FILE = "memo_history.json"

def save_to_history(query, cases):
    history = []
    if os.path.exists(HISTORY_FILE):
        try:
            with open(HISTORY_FILE, "r") as f:
                history = json.load(f)
        except:
            history = []
    for item in history:
        if item['query'] == query:
            return

    # Store only lean case data to keep file size manageable
    slim_cases = []
    for c in cases:
        slim_cases.append({
            "filename": c.get("filename", "Unknown"),
            "year": c.get("year", "—"),
            "court": c.get("court", "Supreme Court of India"),
            "act": c.get("act", "N/A"),
            "holding": c.get("holding", ""),
            "confidence_score": c.get("confidence_score", 0),
        })

    history.insert(0, {
        "id": len(history) + 1,
        "query": query,
        "timestamp": datetime.now().isoformat(),
        "date": datetime.now().strftime("%b %d, %Y · %I:%M %p"),
        "case_count": len(slim_cases),
        "cases": slim_cases
    })
    with open(HISTORY_FILE, "w") as f:
        json.dump(history, f, indent=4)

class SearchQuery(BaseModel):
    query: str

async def orchestrate_agents(query: str):
    yield f"data: {json.dumps({'type': 'status', 'agent': 'intent', 'status': 'running'})}\n\n"
    yield f"data: {json.dumps({'type': 'telemetry', 'agent': 'intent', 'message': f'Analyzing legal intent for: {query}'})}\n\n"
    await asyncio.sleep(1)
    metadata = await asyncio.to_thread(extract_metadata, query)
    yield f"data: {json.dumps({'type': 'telemetry', 'agent': 'intent', 'message': 'Filters identified.', 'data': metadata})}\n\n"
    yield f"data: {json.dumps({'type': 'status', 'agent': 'intent', 'status': 'complete'})}\n\n"

    yield f"data: {json.dumps({'type': 'status', 'agent': 'researcher', 'status': 'running'})}\n\n"
    yield f"data: {json.dumps({'type': 'telemetry', 'agent': 'researcher', 'message': 'Scanning 75-year judicial vault...'})}\n\n"
    await asyncio.sleep(1)
    raw_results = await asyncio.to_thread(query_collection, query, metadata)
    cases = await asyncio.to_thread(format_results, raw_results, metadata)
    yield f"data: {json.dumps({'type': 'telemetry', 'agent': 'researcher', 'message': f'Found {len(cases)} relevant precedents.', 'data': cases})}\n\n"
    yield f"data: {json.dumps({'type': 'status', 'agent': 'researcher', 'status': 'complete'})}\n\n"

    if not cases:
        yield f"data: {json.dumps({'type': 'telemetry', 'agent': 'orchestrator', 'message': 'No precedents found for this specific query.'})}\n\n"
        return

    yield f"data: {json.dumps({'type': 'status', 'agent': 'analysis', 'status': 'running'})}\n\n"
    yield f"data: {json.dumps({'type': 'telemetry', 'agent': 'analysis', 'message': 'Synthesizing judicial holdings...'})}\n\n"
    await asyncio.sleep(1)
    summaries = await asyncio.to_thread(run_summarizer, cases)
    yield f"data: {json.dumps({'type': 'telemetry', 'agent': 'analysis', 'message': 'Summary extraction complete.'})}\n\n"
    yield f"data: {json.dumps({'type': 'status', 'agent': 'analysis', 'status': 'complete'})}\n\n"

    yield f"data: {json.dumps({'type': 'status', 'agent': 'validation', 'status': 'running'})}\n\n"
    yield f"data: {json.dumps({'type': 'telemetry', 'agent': 'validation', 'message': 'Applying constitutional scrutiny and validation...'})}\n\n"
    await asyncio.sleep(1)
    validated_cases = await asyncio.to_thread(run_critic, summaries, query)
    yield f"data: {json.dumps({'type': 'telemetry', 'agent': 'validation', 'message': 'Validation complete.'})}\n\n"
    yield f"data: {json.dumps({'type': 'status', 'agent': 'validation', 'status': 'complete'})}\n\n"
    
    yield f"data: {json.dumps({'type': 'status', 'agent': 'memorandum', 'status': 'running'})}\n\n"
    yield f"data: {json.dumps({'type': 'telemetry', 'agent': 'memorandum', 'message': 'Drafting executive memorandum...'})}\n\n"
    await asyncio.sleep(1)
    save_to_history(query, validated_cases)
    yield f"data: {json.dumps({'type': 'telemetry', 'agent': 'memorandum', 'message': 'Executive research complete.'})}\n\n"
    yield f"data: {json.dumps({'type': 'status', 'agent': 'memorandum', 'status': 'complete'})}\n\n"

    yield f"data: {json.dumps({'type': 'payload', 'agent': 'critic', 'data': validated_cases})}\n\n"

@app.post("/api/research")
async def generate_legal_memo(request: SearchQuery):
    return StreamingResponse(orchestrate_agents(request.query), media_type="text/event-stream")

@app.post("/api/explorer")
async def explorer_search(request: dict):
    query = request.get("query", "")
    filters = request.get("filters", {})
    page = request.get("page", 1)
    limit = request.get("limit", 12)

    smart_filters = {}
    if query and query.strip() and query != "*":
        smart_filters = await asyncio.to_thread(extract_metadata, query)

    metadata_filters = {
        "act": filters.get("act") if filters.get("act") != "All" else smart_filters.get("act"),
        "court": filters.get("court") if filters.get("court") != "All" else smart_filters.get("court")
    }

    year_range = filters.get("year_range")
    if year_range and (year_range[0] != 1950 or year_range[1] != 2025):
        metadata_filters["year"] = f"between {year_range[0]} and {year_range[1]}"
    elif smart_filters.get("year"):
        metadata_filters["year"] = smart_filters.get("year")

    cases = []
    total = 0

    try:
        db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "chroma_db")
        client = chromadb.PersistentClient(path=db_path)
        collection = client.get_collection(name="lexagent_precedents")

        if query and query.strip() and query != "*":
            raw_results = await asyncio.to_thread(query_collection, query, metadata_filters)
            cases = await asyncio.to_thread(format_results, raw_results, metadata_filters)
            # Enrich with court/act from metadata
            for case in cases:
                case.setdefault("court", "Supreme Court of India")
                case.setdefault("act", "N/A")
            total = len(cases)
        else:
            where_clause = _build_where_clause(metadata_filters)
            get_args = {"limit": 100}
            if where_clause:
                get_args["where"] = where_clause
            results = await asyncio.to_thread(collection.get, **get_args)
            for i, meta in enumerate(results['metadatas']):
                cases.append({
                    "id": i + 1,
                    "filename": meta.get('filename', 'Unknown'),
                    "year": meta.get('year', 'Unknown'),
                    "court": meta.get('court', 'Supreme Court of India'),
                    "act": meta.get('act', 'N/A'),
                    "source_link": meta.get('source_link', '')
                })
            total = collection.count() if not where_clause else len(cases)

        cases.sort(key=lambda x: str(x.get('year', '0')), reverse=True)
        start = (page - 1) * limit
        end = start + limit

        return {"total": total, "page": page, "cases": cases[start:end]}

    except Exception as e:
        print(f"[Explorer Error] {e}")
        return {"total": 0, "page": 1, "cases": [], "error": str(e)}


@app.post("/api/case-detail")
async def case_detail(request: dict):
    """Fetch full case content + AI insights for a specific case filename."""
    filename = request.get("filename", "")
    if not filename:
        return {"error": "No filename provided"}

    try:
        db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "chroma_db")
        client = chromadb.PersistentClient(path=db_path)
        collection = client.get_collection(name="lexagent_precedents")

        results = await asyncio.to_thread(
            collection.get,
            where={"filename": {"$eq": filename}},
            limit=1,
            include=["documents", "metadatas"]
        )

        if not results["documents"]:
            return {"error": "Case not found in database"}

        content = results["documents"][0]
        meta = results["metadatas"][0]

        from langchain_ollama import OllamaLLM
        llm = OllamaLLM(model="llama3.2")
        insight_prompt = f"""You are an expert Indian legal analyst. Analyze this case and provide a concise structured summary.

Case Text:
{content[:3000]}

Respond in exactly this format:
HOLDING: [One sentence — what the court finally decided]
KEY FACTS: [2-3 bullet points of critical facts]
LEGAL PRINCIPLE: [The main legal rule or ratio established]
SIGNIFICANCE: [Why this precedent matters]"""

        insights = await asyncio.to_thread(llm.invoke, insight_prompt)

        return {
            "filename": filename,
            "year": meta.get("year", "Unknown"),
            "court": meta.get("court", "Supreme Court of India"),
            "act": meta.get("act", "N/A"),
            "source_link": meta.get("source_link", ""),
            "content_preview": content[:2000],
            "insights": insights
        }

    except Exception as e:
        print(f"[Case Detail Error] {e}")
        return {"error": str(e)}


@app.get("/api/history")
async def get_history():
    if os.path.exists(HISTORY_FILE):
        with open(HISTORY_FILE, "r") as f:
            return json.load(f)
    return []

@app.get("/")
async def health_check():
    return {"status": "LexAgent AI Engine is Online!"}