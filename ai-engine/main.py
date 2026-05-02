from fastapi import FastAPI
from pydantic import BaseModel
from agent import run_research_agent

app = FastAPI(title="LexAgent API")

# Define the data structure we expect from the React/Node frontend
class SearchQuery(BaseModel):
    query: str

@app.post("/api/research")
async def generate_legal_memo(request: SearchQuery):
    try:
        # Trigger the Ollama Agent
        memo_content = run_research_agent(request.query)
        
        # Return the generated memo back to the frontend
        return {
            "status": "success",
            "query": request.query,
            "memo": memo_content
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

@app.get("/")
async def health_check():
    return {"status": "LexAgent AI Engine is Online!"}