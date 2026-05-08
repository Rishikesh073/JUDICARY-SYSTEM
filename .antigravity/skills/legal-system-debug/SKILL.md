---
name: legal-system-debug
description: Systematic troubleshooting for AI agent failures, port conflicts, and database errors.
---

# Legal System Debugging

## Common Failure Modes

### 1. "Engine Connection Failed"
**Cause:** Node cannot reach FastAPI or Port 5001 is dead.
**Fix:** 
- Run `lsof -i :8000` and `lsof -i :5001`.
- Restart Uvicorn and Node in separate terminals.

### 2. "Empty Research Results"
**Cause:** ChromaDB index mismatch or excessive metadata filtering.
**Fix:**
- Check `researcher.py` logs to see what filters the LLM extracted.
- Run `python3 vector_store.py` to rebuild the index if metadata schema changed.

### 3. "SSE Stream Cutoff"
**Cause:** Express buffering or LLM timeout.
**Fix:**
- Verify `res.flushHeaders()` is present in `server.js`.
- Check if Ollama is running: `curl http://localhost:11434/api/tags`.

## Debugging Commands
- **View Python Logs:** `tail -f ai_engine.log` (if enabled).
- **Check Port Health:** `nc -zv localhost 8000 5001 3000`.
- **Kill All:** `lsof -ti:3000,5001,8000 | xargs kill -9`.
