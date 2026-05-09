import json
from langchain_ollama import OllamaLLM

def run_summarizer(cases: list):
    print("[Summarizer] Extracting holding and ratio for each case...", flush=True)
    llm = OllamaLLM(model="llama3.2")
    
    summarized_cases = []
    for case in cases:
        prompt = f"""You are an elite legal analyst preparing a court-grade legal digest.
        Read the following case excerpt and extract precise details.
        
        Required keys:
        "holding": "Full verbatim holding, quoted or as close to verbatim as possible",
        "ratio_decidendi": "Full ratio decidendi with the legal principle applied by the court",
        "obiter_dicta": "All obiter dicta or incidental observations; use an empty string if none",
        "dissenting_opinion": "Full dissenting opinion if present, otherwise 'None'",
        "bench_strength": "Number of judges on the bench, as a number or string if unclear",
        "date_of_judgment": "Exact date of judgment as stated in the case text",
        "coram": "Names of all judges on the bench",
        "cited_precedents": ["List every cited precedent exactly as named in the text"],
        "crime_charges": "Specific criminal charges or sections invoked (e.g. 'IPC Section 420', 'PMLA Section 3', 'BNS Section 318'). If none, 'N/A'",
        "sentence_duration": "The prison sentence or penalty imposed (e.g. '7 years rigorous imprisonment', 'Life imprisonment', 'Fine of Rs. 5 Lakhs'). If not applicable (e.g. bail case), 'N/A'",
        "special_case_flag": "Is this a landmark, rarest-of-rare, constitutional bench, death penalty, or otherwise exceptional case? Answer 'Yes - [reason]' or 'No'",
        "relevance_to_query": "A one-sentence explanation of why this case was selected as relevant to the user's specific query",
        "outcome": "Final disposition of the case, such as allowed, dismissed, granted, rejected, remanded, or similar"

        Rules:
        - Do not summarize loosely when the text contains exact legal language.
        - Prefer verbatim legal phrasing for holding and ratio.
        - If a field is not present, use "Not specified" for strings and [] for cited precedents.
        - Return ONLY a valid JSON object and nothing else.
        - Do not include markdown fences, commentary, or prose outside the JSON object.
        
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
            
            cleaned = cleaned.strip()
            
            try:
                parsed = json.loads(cleaned)
            except json.JSONDecodeError:
                cleaned_robust = cleaned.replace('\\', '\\\\')
                parsed = json.loads(cleaned_robust)

            case['holding'] = parsed.get("holding", "Not found")
            case['ratio_decidendi'] = parsed.get("ratio_decidendi", "Not found")
            case['obiter_dicta'] = parsed.get("obiter_dicta", "Not found")
            case['dissenting_opinion'] = parsed.get("dissenting_opinion", "None")
            case['bench_strength'] = parsed.get("bench_strength", "Unknown")
            case['date_of_judgment'] = parsed.get("date_of_judgment", "Unknown")
            case['coram'] = parsed.get("coram", "Unknown")
            case['cited_precedents'] = parsed.get("cited_precedents", [])
            case['outcome'] = parsed.get("outcome", "See holding")
            case['crime_charges'] = parsed.get("crime_charges", "N/A")
            case['sentence_duration'] = parsed.get("sentence_duration", "N/A")
            case['special_case_flag'] = parsed.get("special_case_flag", "No")
            case['relevance_to_query'] = parsed.get("relevance_to_query", "Directly related to legal query.")
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
            case['crime_charges'] = "N/A"
            case['sentence_duration'] = "N/A"
            case['special_case_flag'] = "No"
            case['relevance_to_query'] = "Selected based on semantic relevance."
            case['outcome'] = "Error"
            
        summarized_cases.append(case)
        
    return summarized_cases
