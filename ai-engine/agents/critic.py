from langchain_ollama import OllamaLLM
from agents.state import AgentState

llm = OllamaLLM(model="llama3.2")

def critic_agent(state: AgentState):
    summaries = state['summaries']
    query = state['query']
    
    print(f"[Agent: Critic] Auditing precedents for relevance and conflict...")
    
    approved = []
    dissenting = []
    
    for item in summaries:
        prompt = f"""
        Does the following case holding DIRECTLY support the user's intent? 
        Or does it provide a counter-argument/dissenting view?
        
        USER INTENT: "{query}"
        CASE SUMMARY: "{item['summary']}"
        
        Reply with exactly: 'SUPPORT' or 'DISSENT' followed by a one-line reason.
        """
        
        evaluation = llm.invoke(prompt)
        
        if "SUPPORT" in evaluation.upper():
            approved.append({**item, "critic_note": evaluation})
        else:
            dissenting.append({**item, "critic_note": evaluation})

    return {
        "approved_cases": approved,
        "dissenting_cases": dissenting,
        "logs": [f"Critic: Audited cases. Found {len(approved)} supportive and {len(dissenting)} dissenting views."]
    }
