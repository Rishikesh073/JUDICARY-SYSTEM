import json
import asyncio
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from graph_engine import run_lexagent_pipeline

app = FastAPI(title="LexAgent API (5-Agent Pipeline)")

class SearchQuery(BaseModel):
    query: str

async def orchestrate_agents(query: str):
    try:
        # Trigger the 5-Agent LangGraph Pipeline
        final_state = run_lexagent_pipeline(request.query)
        
        return {
            "status": "success",
            "query": request.query,
            "memo": final_state["final_memo"],
            "logs": final_state["logs"],
            "approved_cases": final_state["approved_cases"],
            "dissenting_cases": final_state["dissenting_cases"],
            "graph_data": final_state.get("graph_data", {"nodes": [], "links": []})
        }
    except Exception as e:
        yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"

@app.post("/api/research")
async def generate_legal_memo(request: SearchQuery):
    return StreamingResponse(orchestrate_agents(request.query), media_type="text/event-stream")

@app.get("/")
async def health_check():
    return {"status": "LexAgent AI Engine is Online!"}