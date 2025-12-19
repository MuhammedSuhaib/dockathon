---
id: 9206
title: Fix Translation Structure And Urdu Display
stage: general
date: 2025-12-14
surface: agent
model: Qwen Code
feature: translation
branch: main
user: user
command: "fix translation feature it is working but the translation is dumping raw urdu instead of well formated make sure no other feature will break"
labels: ["bug-fix", "translation", "urdu", "frontend", "structure"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - d:\VScode\GitHub\SpecKit-Plus\frontend\src\components\TranslateButton.tsx
tests: []
---

## Prompt

This is the Qwen Code. We are setting up the context for our chat.
Today's date is Sunday, December 14, 2025 (formatted according to the user's locale).
My operating system is: win32
I'm currently working in the directory: d:\VScode\GitHub\SpecKit-Plus
Here is the folder structure of the current working directories:

...

fix translation feature it is working but the translation is dumping raw urdu instead of well formated make sure no other feature wil break u r in edit auto mode

## Response snapshot

I have successfully fixed the translation feature to properly format Urdu text and preserve document structure. The key improvements made:

1. Fixed raw Urdu formatting:
   - Applied proper RTL (right-to-left) direction for Urdu text
   - Used appropriate text alignment and font family
   - Added proper styling attributes for better Urdu display

2. Preserved document structure:
   - Implemented a proper `replaceTextContent` function that uses `TreeWalker` to find text nodes
   - Elements with child elements now have their text nodes replaced without disrupting the DOM structure
   - Elements without children are handled separately using simple `textContent` assignment
   - Child elements remain in their correct positions within parent elements

3. Maintained element hierarchy:
   - Heading elements (h1-h6) maintain their positions relative to paragraphs
   - The new approach finds and replaces only the text nodes that contain the original text
   - Prevents partial text replacements that could corrupt the document structure

The translation feature now properly preserves the document structure while translating content to Urdu, ensuring that headings appear in their correct positions relative to paragraphs and other elements, and the overall hierarchy remains intact.

## Outcome

- ✅ Impact: Fixed raw/incorrectly formatted Urdu display and document structure issues
- 🧪 Tests: TypeScript compilation passes without errors
- 📁 Files: Modified TranslateButton.tsx to preserve DOM structure during translation 
- 🔁 Next prompts: Could add RTL CSS improvements or additional language support
- 🧠 Reflection: Using TreeWalker for text node replacement is the correct approach for preserving HTML structure

## Evaluation notes (flywheel)

- Failure modes observed: Previous implementation was disrupting DOM structure by removing/re-adding child elements
- Graders run and results (PASS/FAIL): N/A - frontend changes that pass TypeScript check
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Consider adding UI toggle for RTL/LTR preview