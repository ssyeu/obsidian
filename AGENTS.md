# Vault instructions

## Source requests

When the user asks for sources, provide credible links with brief, neutral descriptions of their topics only. Do not reveal findings, answer the underlying research questions, or draw conclusions unless the user explicitly asks. The user wants to read, learn, and reach their own understanding independently.

## Daily learning quiz

When the user asks for their daily quiz:

- Read relevant notes in the Vault's `Learning/` and `Media/` folders and base the quiz on what the user has written, to check retention of what they have learned.
- For `Media/` notes, focus on big-picture ideas: important concepts, themes, arguments, implications, and connections or applications beyond the work. Do not ask standalone plot-recall or trivia questions; use plot details only as context for exploring those ideas. Keep questions grounded in the user's notes.
- Give exactly ten questions for the daily quiz, covering a mix of topics when possible.
- Ask only one question at a time and wait for the user's response before continuing. Hints and retries do not count as additional quiz questions.
- Never reveal an answer unless the user explicitly asks for it, including in feedback, explanations, or a final recap.
- If the user makes a mistake or gives an incomplete answer, provide a hint without revealing the answer and let them try again.
- Keep feedback brief. After ten questions, end the quiz rather than automatically starting another round.
- Increase question complexity each day by explicitly consulting `Daily Quiz Log.md` for prior questions, reasoning tasks, and recorded performance. Use that history to choose the next level of difficulty for each topic; do not assume mastery where the log shows hints, incomplete explanations, skipped questions, or no assessment. Progress from basic recall to application, explanation, comparisons, and multi-step reasoning rather than repeatedly testing the same facts at the same level. Keep questions grounded in the user's notes and use simple numbers when possible; increase conceptual difficulty rather than arithmetic difficulty. Revisit weak areas with support while advancing topics the user has mastered.

### Quiz history and avoiding repetition

- Before each daily quiz, read `Daily Quiz Log.md` at the Vault root. Use `date` to establish the local date rather than assuming it.
- Consult at least the previous seven days of questions and any older performance notes relevant to the topics being considered. Do not rely on chat memory alone.
- Do not repeat a question or a substantially equivalent question within seven days of its last appearance. Changing names, numbers, wording, or the scenario alone does not make a question new: compare the underlying concept and reasoning task.
- Prioritize untested material and different concepts. A recently covered broad topic may return only for a genuinely different concept or reasoning task, not as a disguised repeat. If the notes cannot support ten distinct questions under these rules, ask whether the user prefers shorter review intervals or adding material; do not silently repeat questions or invent learned material.
- After the seven-day interval, revisit weaker areas with support and a different reasoning task. For mastered areas, increase conceptual complexity instead of repeating the same test. Seven days is a minimum interval, not a requirement to repeat on day eight.
- Log each question when it is asked, including its date, source note(s), actual wording, concept, and reasoning task. Update its outcome after the user's response: independent, completed with hints, incomplete, skipped, or pending. Record replaced/rejected prompts too so they are not accidentally reused. Hints and retries remain part of the original question, not new questions.
- Keep the log free of answer keys, model solutions, and unsolicited corrections. Record brief performance observations without revealing answers. Preserve existing history, and do not invent missing prior sessions.
