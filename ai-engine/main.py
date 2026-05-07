from fastapi import FastAPI
from pydantic import BaseModel
from graph_engine import run_lexagent_pipeline

app = FastAPI(title="LexAgent API (5-Agent Pipeline)")

class SearchQuery(BaseModel):
    query: str

@app.post("/api/research")
async def generate_legal_memo(request: SearchQuery):
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
        return {
            "status": "error",
            "message": str(e)
        }

@app.get("/")
async def health_check():
    return {"status": "LexAgent AI Engine is Online!"}