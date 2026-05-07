import json
from langchain_ollama import OllamaLLM

def run_critic(cases: list, query: str):
    print("[Critic] Evaluating cases against the original query...")
    llm = OllamaLLM(model="llama3.2")
    
    evaluated_cases = []
    for case in cases:
        prompt = f"""You are a senior legal critic. Evaluate the relevance and validity of the following case in the context of the user's query.
        
        USER QUERY: "{query}"
        
        CASE HOLDING: {case.get('holding')}
        CASE RATIO: {case.get('ratio_decidendi')}
        
        Determine if this case is "Approved" (highly relevant and supportive), "Dissenting" (relevant but contrasting), or "Rejected" (irrelevant).
        Also assign a confidence score between 1 and 100.
        
        Output your response ONLY as a valid JSON object with the keys: "verdict" (must be exactly "Approved", "Dissenting", or "Rejected") and "confidence_score" (an integer).
        Do not include markdown blocks or any other text.
        """
        response = llm.invoke(prompt)
        
        try:
            cleaned = response.strip()
            if cleaned.startswith("```json"):
                cleaned = cleaned[7:]
            if cleaned.startswith("```"):
                cleaned = cleaned[3:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
                
            parsed = json.loads(cleaned.strip())
            verdict = parsed.get("verdict", "Rejected")
            if verdict not in ["Approved", "Dissenting", "Rejected"]:
                verdict = "Rejected"
                
            case['verdict'] = verdict
            case['confidence_score'] = int(parsed.get("confidence_score", 0))
        except Exception as e:
            print(f"[Critic] Error parsing JSON for case {case['filename']}: {e}\\nResponse was: {response}")
            case['verdict'] = "Rejected"
            case['confidence_score'] = 0
            
        evaluated_cases.append(case)
        
    return evaluated_cases
