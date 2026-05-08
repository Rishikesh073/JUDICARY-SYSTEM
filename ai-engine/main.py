import json
import asyncio
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from agents.researcher import run_researcher, get_collection_stats, extract_metadata, query_collection, format_results
from agents.summarizer import run_summarizer
from agents.critic import run_critic
import os

HISTORY_FILE = "memo_history.json"

def save_to_history(query, cases):
    history = []
    if os.path.exists(HISTORY_FILE):
        try:
            with open(HISTORY_FILE, "r") as f:
                history = json.load(f)
        except:
            history = []
    
    # Calculate avg confidence
    avg_conf = 0
    if cases:
        avg_conf = sum(c.get('confidence_score', 0) for c in cases) / len(cases)

    new_entry = {
        "query": query,
        "timestamp": os.path.getmtime(HISTORY_FILE) if os.path.exists(HISTORY_FILE) else 0, # Placeholder
        "case_count": len(cases),
        "avg_confidence": round(avg_conf, 1),
        "date": "Just now" # UI will handle relative time
    }
    
    import datetime
    new_entry["timestamp"] = datetime.datetime.now().isoformat()
    
    history.insert(0, new_entry)
    with open(HISTORY_FILE, "w") as f:
        json.dump(history[:20], f, indent=2)

app = FastAPI(title="LexAgent API")

class SearchQuery(BaseModel):
    query: str

async def orchestrate_agents(query: str):
    try:
        # 1. Intent Agent
        yield f"data: {json.dumps({'type': 'status', 'agent': 'intent', 'status': 'running'})}\n\n"
        yield f"data: {json.dumps({'type': 'telemetry', 'agent': 'intent', 'message': 'Analyzing legal intent and extracting metadata...'})}\n\n"
        
        metadata = await asyncio.to_thread(extract_metadata, query)
        
        if metadata.get('act'):
            yield f"data: {json.dumps({'type': 'telemetry', 'agent': 'intent', 'message': f'Detected statute: {metadata['act']}'})}\n\n"
        if metadata.get('year'):
            yield f"data: {json.dumps({'type': 'telemetry', 'agent': 'intent', 'message': f'Detected timeframe: {metadata['year']}'})}\n\n"
        if metadata.get('court'):
            yield f"data: {json.dumps({'type': 'telemetry', 'agent': 'intent', 'message': f'Jurisdiction: {metadata['court']}'})}\n\n"
        
        yield f"data: {json.dumps({'type': 'status', 'agent': 'intent', 'status': 'complete'})}\n\n"
        
        # 2. Research Agent
        yield f"data: {json.dumps({'type': 'status', 'agent': 'researcher', 'status': 'running'})}\n\n"
        yield f"data: {json.dumps({'type': 'telemetry', 'agent': 'researcher', 'message': 'Connecting to vector database...'})}\n\n"
        
        raw_results = await asyncio.to_thread(query_collection, query, metadata)
        
        yield f"data: {json.dumps({'type': 'telemetry', 'agent': 'researcher', 'message': 'Query embeddings generated. Scanning precedents...'})}\n\n"
        
        cases = await asyncio.to_thread(format_results, raw_results, metadata)
        
        yield f"data: {json.dumps({'type': 'telemetry', 'agent': 'researcher', 'message': f'Identified {len(cases)} relevant authorities.'})}\n\n"
        yield f"data: {json.dumps({'type': 'status', 'agent': 'researcher', 'status': 'complete'})}\n\n"
        
        # 3. Analysis Agent (Summarizer)
        yield f"data: {json.dumps({'type': 'status', 'agent': 'analysis', 'status': 'running'})}\n\n"
        yield f"data: {json.dumps({'type': 'telemetry', 'agent': 'analysis', 'message': 'Extracting ratio decidendi and judicial logic...'})}\n\n"
        
        summarized_cases = await asyncio.to_thread(run_summarizer, cases)
        
        yield f"data: {json.dumps({'type': 'status', 'agent': 'analysis', 'status': 'complete'})}\n\n"
        
        # 4. Validation Agent (Critic)
        yield f"data: {json.dumps({'type': 'status', 'agent': 'validation', 'status': 'running'})}\n\n"
        yield f"data: {json.dumps({'type': 'telemetry', 'agent': 'validation', 'message': 'Checking citation hierarchy for consistency...'})}\n\n"
        
        evaluated_cases = await asyncio.to_thread(run_critic, summarized_cases, query)
        
        yield f"data: {json.dumps({'type': 'status', 'agent': 'validation', 'status': 'complete'})}\n\n"
        
        # 5. Memorandum Agent
        yield f"data: {json.dumps({'type': 'status', 'agent': 'memorandum', 'status': 'running'})}\n\n"
        yield f"data: {json.dumps({'type': 'telemetry', 'agent': 'memorandum', 'message': 'Synthesizing final legal memorandum...'})}\n\n"
        
        await asyncio.to_thread(save_to_history, query, evaluated_cases)

        yield f"data: {json.dumps({'type': 'payload', 'agent': 'critic', 'data': evaluated_cases})}\n\n"
        yield f"data: {json.dumps({'type': 'status', 'agent': 'memorandum', 'status': 'complete'})}\n\n"
        
        yield f"data: {json.dumps({'type': 'done'})}\n\n"
        
    except Exception as e:
        yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"

@app.get("/api/stats")
async def get_stats():
    stats = await asyncio.to_thread(get_collection_stats)
    history = []
    if os.path.exists(HISTORY_FILE):
        with open(HISTORY_FILE, "r") as f:
            history = json.load(f)
    
    return {
        "collection": stats,
        "history": history
    }

@app.post("/api/research")
async def generate_legal_memo(request: SearchQuery):
    return StreamingResponse(orchestrate_agents(request.query), media_type="text/event-stream")

@app.get("/")
async def health_check():
    return {"status": "LexAgent AI Engine is Online!"}