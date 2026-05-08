import json
import asyncio
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from agents.researcher import run_researcher, get_collection_stats
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
        # 1. Researcher
        yield f"data: {json.dumps({'type': 'status', 'agent': 'researcher', 'status': 'running'})}\n\n"
        await asyncio.sleep(0.1)
        cases = await asyncio.to_thread(run_researcher, query)
        yield f"data: {json.dumps({'type': 'payload', 'agent': 'researcher', 'data': cases})}\n\n"
        yield f"data: {json.dumps({'type': 'status', 'agent': 'researcher', 'status': 'complete'})}\n\n"
        
        # 2. Summarizer
        yield f"data: {json.dumps({'type': 'status', 'agent': 'summarizer', 'status': 'running'})}\n\n"
        await asyncio.sleep(0.1)
        summarized_cases = await asyncio.to_thread(run_summarizer, cases)
        yield f"data: {json.dumps({'type': 'payload', 'agent': 'summarizer', 'data': summarized_cases})}\n\n"
        yield f"data: {json.dumps({'type': 'status', 'agent': 'summarizer', 'status': 'complete'})}\n\n"
        
        # 3. Critic
        yield f"data: {json.dumps({'type': 'status', 'agent': 'critic', 'status': 'running'})}\n\n"
        await asyncio.sleep(0.1)
        evaluated_cases = await asyncio.to_thread(run_critic, summarized_cases, query)
        
        # Save to history
        await asyncio.to_thread(save_to_history, query, evaluated_cases)

        yield f"data: {json.dumps({'type': 'payload', 'agent': 'critic', 'data': evaluated_cases})}\n\n"
        yield f"data: {json.dumps({'type': 'status', 'agent': 'critic', 'status': 'complete'})}\n\n"
        
        # Done
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