from langchain_ollama import OllamaLLM
from agents.state import AgentState

llm = OllamaLLM(model="llama3.2")

import re
import random

def synthesizer_agent(state: AgentState):
    approved = state['approved_cases']
    dissenting = state['dissenting_cases']
    query = state['query']
    
    print(f"[Agent: Synthesizer] Drafting final legal memorandum...")
    
    # Construct context
    support_text = "\n".join([f"- {c['filename']}: {c['summary']}" for c in approved])
    dissent_text = "\n".join([f"- {c['filename']}: {c['summary']}" for c in dissenting])
    
    prompt = f"""
    You are LexAgent, a senior legal clerk. Write a 2-page court-ready legal memo for: "{query}"
    
    STRUCTURE:
    ## 1. Executive Summary
    ## 2. Supporting Precedents & Analysis
    {support_text}
    
    ## 3. Dissenting/Distinguished Views
    {dissent_text}
    
    ## 4. Final Recommendation
    
    Citations must use filenames and provide clear reasoning.
    """
    
    memo = llm.invoke(prompt)

    # Helper function to generate rich metadata for the UI graph
    def get_node_metadata(filename, summary):
        clean_name = filename.replace('.pdf', '').replace('_', ' ')
        year_match = re.search(r'20\d\d', filename)
        year = year_match.group(0) if year_match else "2025"
        
        return {
            "case_name": clean_name[:40] + "..." if len(clean_name) > 40 else clean_name,
            "case_no": f"SC/CRA/{random.randint(1000, 9999)}/{year}",
            "date": f"{random.randint(1, 28)}/02/{year}",
            "charges": "Bail Application under PMLA",
            "type": "Criminal Appellate Jurisdiction",
            "acts": "PMLA 2002, Sec 45; BNS 2023",
            "judgement": summary[:120] + "..."
        }

    # Generate mock graph data for the demo
    # We MUST deduplicate nodes, otherwise D3 forceSimulation will assign NaN coordinates
    # and the SVG will appear blank without throwing any JS errors.
    seen_files = set()
    nodes = []
    
    # Add approved cases
    for c in approved:
        fname = c.get('filename', f"Unknown_{len(seen_files)}")
        if fname not in seen_files:
            seen_files.add(fname)
            meta = get_node_metadata(fname, c.get('summary', ''))
            nodes.append({"id": fname, "name": fname, "group": "approved", "metadata": meta})
            
    # Add dissenting cases to make the graph richer
    for c in dissenting:
        fname = c.get('filename', f"Unknown_{len(seen_files)}")
        if fname not in seen_files:
            seen_files.add(fname)
            meta = get_node_metadata(fname, c.get('summary', ''))
            nodes.append({"id": fname, "name": fname, "group": "dissenting", "metadata": meta})

    links = []
    if len(nodes) > 1:
        # Create a chain of citations for the visual
        for i in range(len(nodes) - 1):
            links.append({"source": nodes[i+1]['id'], "target": nodes[i]['id']})

    return {
        "final_memo": memo,
        "logs": ["Synthesizer: Memo finalized with multi-agent reasoning."],
        "graph_data": {"nodes": nodes, "links": links}
    }
