---
name: lexagent-research-pipeline
description: Orchestration and debugging of the 5-step Legal Research Pipeline.
---

# LexAgent Research Pipeline

## Overview
Manages the communication between the React Frontend, Express Bridge (5001), and FastAPI AI Engine (8000).

## The 5 Steps
1. **Researcher:** ChromaDB query with metadata filters.
2. **Found Cases:** Semantic retrieval results.
3. **Summarizer:** Extraction of Holding/Ratio via LLM.
4. **Critic:** Relevance evaluation and verdict assignment.
5. **Interactive Memo:** Frontend rendering of the final memo.

## Debugging Workflow
If "Engine connection failed" occurs:
1. Kill orphan processes: `lsof -t -i :8000 -i :5001 -i :3000 | xargs kill -9`
2. Start Python: `cd ai-engine && uvicorn main:app --port 8000`
3. Start Node: `cd backend && node server.js`
4. Start React: `cd frontend && npm run dev -- --port 3000`

## Validation
A successful pipeline run must show "status: complete" for all 3 agents in the SSE stream.
