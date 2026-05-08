import json
import asyncio
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from agents.researcher import run_researcher
from agents.summarizer import run_summarizer
from agents.critic import run_critic

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
        yield f"data: {json.dumps({'type': 'payload', 'agent': 'critic', 'data': evaluated_cases})}\n\n"
        yield f"data: {json.dumps({'type': 'status', 'agent': 'critic', 'status': 'complete'})}\n\n"
        
        # Done
        yield f"data: {json.dumps({'type': 'done'})}\n\n"
        
    except Exception as e:
        yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"

@app.post("/api/research")
async def generate_legal_memo(request: SearchQuery):
    return StreamingResponse(orchestrate_agents(request.query), media_type="text/event-stream")

@app.get("/")
async def health_check():
    return {"status": "LexAgent AI Engine is Online!"}