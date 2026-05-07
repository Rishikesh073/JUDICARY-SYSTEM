import json
from langchain_ollama import OllamaLLM

def run_summarizer(cases: list):
    print("[Summarizer] Extracting holding and ratio for each case...")
    llm = OllamaLLM(model="llama3.2")
    
    summarized_cases = []
    for case in cases:
        prompt = f"""You are a legal summarizer. Read the following case excerpt and extract the Holding, Ratio Decidendi, and Outcome.
        Output your response ONLY as a valid JSON object with the following keys: "holding", "ratio_decidendi", "outcome".
        Do not include markdown blocks or any other text.
        
        CASE EXCERPT:
        {case['content']}
        """
        response = llm.invoke(prompt)
        
        try:
            # Try to parse the JSON response
            cleaned = response.strip()
            if cleaned.startswith("```json"):
                cleaned = cleaned[7:]
            if cleaned.startswith("```"):
                cleaned = cleaned[3:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            
            parsed = json.loads(cleaned.strip())
            case['holding'] = parsed.get("holding", "Not found")
            case['ratio_decidendi'] = parsed.get("ratio_decidendi", "Not found")
            case['outcome'] = parsed.get("outcome", "Not found")
        except Exception as e:
            print(f"[Summarizer] Error parsing JSON for case {case['filename']}: {e}\\nResponse was: {response}")
            case['holding'] = "Failed to extract holding."
            case['ratio_decidendi'] = "Failed to extract ratio."
            case['outcome'] = "Failed to extract outcome."
            
        summarized_cases.append(case)
        
    return summarized_cases
