---
id: 1
title: Update Qwen SDD Constitution
stage: constitution
date: 2025-12-09
surface: agent
model: Qwen
feature: none
branch: main
user: Qwen
command: /sp.constitution
labels: ["constitution", "governance", "sdd"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests: []
---

## Prompt

```
/sp.constitution # QWEN SDD CONSTITUTION (HACKATHON EDITION)

## CORE PRINCIPLES
- Follow Spec-Driven Development (SDD) exactly.
- Always produce the smallest testable step, not full solutions.
- Never assume missing details. Ask the user for missing context.
- Never generate mockups, fake UI, or imagined APIs.
- Always verify required libraries via Context7 MCP first.
- Never continue automatically. Wait for user approval after each step.
- No eagerness. No auto-expansion. No long detours.
- Respect my rough → refine workflow.

## CONTEXT RULES
- Use only the libraries listed in Context7libs.md:
  - /qdrant/qdrant
  - /neondatabase/neon
  - /openai/chatkit-python
  - /openai/chatkit-js
  - /better-auth/better-auth
  - /fastapi/fastapi
  - /facebook/docusaurus
- When writing code for any of these, always run:
  - "use context7" or specific library IDs if known.
- All answers must be based on *current* APIs from Context7, not guesses.

## TASK EXECUTION RULES
- Before coding: restate the task in one short neutral sentence.
- Then list assumptions; ask if any assumption is wrong.
- Then propose the smallest next step that can be tested by the user.
- After delivering the step, STOP and wait for confirmation.
- If errors appear (quota, server down, missing keys, etc.) focus on diagnosis first.
- Implement features in strict order:
  1. Working ChatKit frontend
  2. Verify existing issues
  3. Text-selection feature
  4. RAG wiring (no DB yet)
  5. Qdrant vector DB
  6. Neon Postgres
  7. Integrations + polishing

## RAG RULES
- Do not hallucinate indexing pipelines.
- Ask for exact document structure before creating embeddings.
- Confirm Qdrant collection schema before creating it.
- Confirm Neon tables before creating them.
- Every RAG step must be testable in isolation.

## SMALL-STEP RULE
- Produce minimal diffs or snippets.
- If editing files, show only the changed part.
- Never modify multiple files unless explicitly told.
- Never "complete the whole feature" in one go.

## CHATKIT RULES
- Use Context7 for chatkit-js and chatkit-python.
- Never fabricate agent examples.
- Use real APIs only.
- Confirm folder structure before generating code.

## FASTAPI RULES
- Do not create large multi-endpoint apps in one output.
- Create one endpoint at a time.
- Always ask for directory paths before creating files.

## SAFETY & QUALITY
- No hallucination.
- No invented APIs.
- No auto-fixes unless asked.
- Prioritize clarity, correctness, and minimalism.
- Always ask before moving to next stage.

## OUTPUT STYLE
- Short, concise.
- Show only what's needed to test the current step.
- No paragraphs unless necessary.
- No extra enthusiasm or eagerness.
```

## Response snapshot

The constitution at `.specify/memory/constitution.md` has been successfully updated from version 1.0.0 to 1.1.0. The new constitution implements the Qwen SDD Constitution (HACKATHON EDITION) with 39 specific principles organized across 8 categories:

1. CORE PRINCIPLES (7 principles)
2. CONTEXT RULES (2 principles)
3. TASK EXECUTION RULES (6 principles)
4. RAG RULES (5 principles)
5. SMALL-STEP RULE (4 principles)
6. CHATKIT RULES (4 principles)
7. FASTAPI RULES (2 principles)
8. SAFETY & QUALITY (5 principles)
9. OUTPUT STYLE (4 principles)

A sync impact report was included at the top of the constitution file, documenting the changes made.

## Outcome

- ✅ Impact: Updated project governance from Backend RAG System Constitution to Qwen SDD Constitution (HACKATHON EDITION)
- 🧪 Tests: No tests required for constitution update
- 📁 Files: Updated .specify/memory/constitution.md
- 🔁 Next prompts: Ready for feature development following new constitution
- 🧠 Reflection: Constitution now properly reflects Qwen's SDD approach with specific rules for Context7 usage, small-step development, and library constraints.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): Original prompt used
- Next experiment (smallest change to try): Begin implementing features according to new constitution