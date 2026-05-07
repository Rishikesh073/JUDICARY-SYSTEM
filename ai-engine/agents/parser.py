import json
from langchain_ollama import OllamaLLM
from agents.state import AgentState

# Initialize LLM
llm = OllamaLLM(model="llama3.2")

def query_parser_agent(state: AgentState):
    query = state['query']
    print(f"[Agent: Parser] Extracting intent from: {query}")
    
    prompt = f"""
    You are a Legal Intent Parser. Convert the following query into a structured JSON object.
    
    Query: "{query}"
    
    Output Format (JSON only):
    {{
        "keywords": ["list", "of", "legal", "terms"],
        "court": "Supreme Court" or "High Court" or "Any",
        "year_range": [start_year, end_year],
        "intent": "e.g., search_precedents, check_validity, summary"
    }}
    """
    
    response = llm.invoke(prompt)
    
    try:
        # Clean the response to extract JSON
        json_str = response.strip()
        if "```json" in json_str:
            json_str = json_str.split("```json")[1].split("```")[0].strip()
        elif "```" in json_str:
            json_str = json_str.split("```")[1].split("```")[0].strip()
            
        parsed_data = json.loads(json_str)
    except Exception:
        # Fallback if LLM fails to output valid JSON
        parsed_data = {
            "keywords": [query],
            "court": "Any",
            "year_range": [2000, 2025],
            "intent": "search_precedents"
        }

    return {
        "parsed_query": parsed_data,
        "logs": [f"Parser: Extracted keywords: {', '.join(parsed_data.get('keywords', []))}"]
    }
