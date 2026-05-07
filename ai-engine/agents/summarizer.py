from langchain_ollama import OllamaLLM
from agents.state import AgentState

llm = OllamaLLM(model="llama3.2")

def summarizer_agent(state: AgentState):
    cases = state['retrieved_cases']
    print(f"[Agent: Summarizer] Distilling {len(cases)} legal precedents...")
    
    summaries = []
    
    # In a production environment, we would run these in parallel (async)
    # For now, we'll process the top 3 for speed
    for case in cases[:3]:
        prompt = f"""
        Extract the 'Ratio Decidendi' (legal reasoning) and 'Final Holding' of this case.
        Keep it concise (2-3 sentences).
        
        CASE TEXT:
        {case['content']}
        """
        
        summary = llm.invoke(prompt)
        summaries.append({
            "filename": case['metadata']['filename'],
            "summary": summary,
            "metadata": case['metadata']
        })

    return {
        "summaries": summaries,
        "logs": [f"Summarizer: Distilled logic for the top 3 precedents."]
    }
