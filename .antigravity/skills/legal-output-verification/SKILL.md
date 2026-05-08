---
name: legal-output-verification
description: Quality assurance and output validation from a senior legal professional's perspective.
---

# Legal Output Verification (Counsel's Audit)

## Overview
Use this skill to audit the AI's research output. It ensures the content meets the high-fidelity standards required by lawyers, judges, and legal researchers.

## Audit Checklist

### 1. Essential Artifacts (The "Must-Haves")
- [ ] **Judgment Date:** Is the exact date of the ruling present?
- [ ] **Bench Strength:** Is the number of judges mentioned?
- [ ] **Coram:** Are the names of the judges correctly listed?
- [ ] **Case Citation:** Is there a proper citation or case number?

### 2. Substance Analysis (Counsel's Perspective)
- [ ] **Holding Sufficiency:** Is the "Holding" a complete legal conclusion, or is it too vague? 
- [ ] **Ratio Decidendi:** Does it clearly explain the *why* behind the ruling?
- [ ] **Precedent Quality:** Are the cited cases relevant and correctly formatted?
- [ ] **Obiter Dicta:** Are passing remarks distinguished from the core holding?

### 3. Professional Formatting
- [ ] **Clarity:** Is the legal jargon used correctly and explained if necessary?
- [ ] **Structure:** Are cases presented in a clear, comparative dashboard (Sidebar + Content)?
- [ ] **Confidence Score:** Does the score accurately reflect the case's relevance to the user's specific query?

## Verification Workflow
When asked to "Audit as a lawyer":
1. Trigger a sample research query.
2. Review the resulting `InteractiveMemo`.
3. Verify each point in the checklist above.
4. If "Not Found" or "Unknown" appears in critical fields (Date/Coram), flag it as a bug in the metadata extractor (`vector_store.py`).
