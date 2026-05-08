import json
from langchain_ollama import OllamaLLM

def run_summarizer(cases: list):
    print("[Summarizer] Extracting holding and ratio for each case...", flush=True)
    llm = OllamaLLM(model="llama3.2")
    
    summarized_cases = []
    for case in cases:
        prompt = f"""You are an elite legal analyst. Read the following case excerpt and extract precise details.
        
        Output your response ONLY as a valid JSON object with the following keys: 
        "holding": "Full verbatim holding",
        "ratio_decidendi": "Core legal principle (Ratio Decidendi)",
        "obiter_dicta": "Incidental remarks (Obiter Dicta)",
        "dissenting_opinion": "Any dissent found, or 'None'",
        "bench_strength": "Number of judges",
        "date_of_judgment": "Exact date",
        "coram": "Names of judges",
        "cited_precedents": ["List of all cases cited"]

        Do not include markdown blocks or any other text.
        
        CASE EXCERPT:
        {case['content']}
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
            case['holding'] = parsed.get("holding", "Not found")
            case['ratio_decidendi'] = parsed.get("ratio_decidendi", "Not found")
            case['obiter_dicta'] = parsed.get("obiter_dicta", "Not found")
            case['dissenting_opinion'] = parsed.get("dissenting_opinion", "None")
            case['bench_strength'] = parsed.get("bench_strength", "Unknown")
            case['date_of_judgment'] = parsed.get("date_of_judgment", "Unknown")
            case['coram'] = parsed.get("coram", "Unknown")
            case['cited_precedents'] = parsed.get("cited_precedents", [])
            case['outcome'] = parsed.get("outcome", "See holding")
        except Exception as e:
            print(f"[Summarizer] Error parsing JSON for case {case['filename']}: {e}\nResponse was: {response}", flush=True)
            case['holding'] = "Failed to extract holding."
            case['ratio_decidendi'] = "Failed to extract ratio."
            case['obiter_dicta'] = "Failed to extract obiter."
            case['dissenting_opinion'] = "Error"
            case['bench_strength'] = "Unknown"
            case['date_of_judgment'] = "Unknown"
            case['coram'] = "Unknown"
            case['cited_precedents'] = []
            
        summarized_cases.append(case)
        
    return summarized_cases
