from langgraph.graph import StateGraph, END
from agents.state import AgentState
from agents.parser import query_parser_agent
from agents.researcher import researcher_agent
from agents.summarizer import summarizer_agent
from agents.critic import critic_agent
from agents.synthesizer import synthesizer_agent

def build_graph():
    # Initialize the graph with our state schema
    workflow = StateGraph(AgentState)
    
    # Add Nodes
    workflow.add_node("parser", query_parser_agent)
    workflow.add_node("researcher", researcher_agent)
    workflow.add_node("summarizer", summarizer_agent)
    workflow.add_node("critic", critic_agent)
    workflow.add_node("synthesizer", synthesizer_agent)
    
    # Set entry point
    workflow.set_entry_point("parser")
    
    # Define Edges (Linear for now)
    workflow.add_edge("parser", "researcher")
    workflow.add_edge("researcher", "summarizer")
    workflow.add_edge("summarizer", "critic")
    workflow.add_edge("critic", "synthesizer")
    workflow.add_edge("synthesizer", END)
    
    # Compile the graph
    return workflow.compile()

def run_lexagent_pipeline(query: str):
    app = build_graph()
    
    # Initial state
    initial_state = {
        "query": query,
        "parsed_query": {},
        "retrieved_cases": [],
        "summaries": [],
        "approved_cases": [],
        "dissenting_cases": [],
        "final_memo": "",
        "graph_data": {"nodes": [], "links": []},
        "logs": ["LexAgent: Starting 5-agent reasoning pipeline..."]
    }
    
    # Run the graph synchronously
    final_state = app.invoke(initial_state)
    return final_state

if __name__ == "__main__":
    # Test script
    res = run_lexagent_pipeline("Can bail be granted in PMLA cases?")
    print("\n--- AGENT LOGS ---")
    for log in res['logs']:
        print(log)
    print("\n--- MEMO ---")
    print(res['final_memo'])
