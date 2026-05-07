from typing import TypedDict, List, Annotated
import operator

class AgentState(TypedDict):
    # The initial query from the user
    query: str
    
    # Structured filters from the Parser (Agent 1)
    parsed_query: dict
    
    # Raw context retrieved from ChromaDB (Agent 2)
    retrieved_cases: List[dict]
    
    # Summarized versions of the cases (Agent 3)
    summaries: List[dict]
    
    # Cases that pass the Critic's filter (Agent 4)
    approved_cases: List[dict]
    
    # Cases flagged as dissenting/counter-arguments (Agent 4)
    dissenting_cases: List[dict]
    
    # The final synthesized memo (Agent 5)
    final_memo: str
    
    # Visual graph data for D3.js (Agent 5)
    graph_data: dict

    # Real-time activity log for the UI (Streaming)
    # Annotated with operator.add so it's an additive list
    logs: Annotated[List[str], operator.add]
