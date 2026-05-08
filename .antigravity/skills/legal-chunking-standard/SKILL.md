---
name: legal-chunking-standard
description: Standardized boundary detection and metadata extraction for legal documents.
---

# Legal Chunking Standard

## Overview
This skill defines how legal documents (Judgments, Orders, Acts) should be split into semantic chunks and how metadata must be extracted for high-precision vector search.

## Triggers
- When modifying `vector_store.py`.
- When adding new document types to the `ai-engine`.
- When encountering search noise or cut-off legal sections.

## Chunking Logic
Always split by legal section boundaries using case-insensitive regex:
- `Held:`
- `Ratio Decidendi:`
- `Obiter Dicta:`
- `Per Curiam:`
- Numbered paragraphs (e.g., `\n1.`, `\n(2)`)

## Metadata Extraction
Every chunk MUST include:
1. `court`: Supreme Court or specific High Court.
2. `year`: 4-digit judgment year.
3. `act`: Primary Act (PMLA, IPC, BNS, etc.).
4. `case_number`: Extracted from the header.

## Validation
After re-chunking, run:
```bash
python3 vector_store.py
```
Verify that the output shows "Vector Database fully populated".
