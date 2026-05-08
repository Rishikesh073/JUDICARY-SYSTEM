---
name: project-planning
description: Structured feature planning and roadmap management for the Judiciary System.
---

# Judiciary System Planning

## Overview
Use this skill when proposing new features, agent modifications, or frontend UI changes. All plans must account for the 3-tier architecture (Python AI -> Express Bridge -> React Frontend).

## Planning Framework
1. **Engine Layer:** Define prompt changes or new ChromaDB metadata needed.
2. **Bridge Layer:** Define new Express routes or SSE events.
3. **UI Layer:** Define React component structure and framer-motion animations.

## Validation Gates
- Does it maintain legal data integrity?
- Is the SSE stream updated to reflect the new state?
- Are there clear error states for the user?
