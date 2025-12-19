---
description: implement a new feature or change
---

1. Check the `traction/CHECKLIST.md` and `traction/TODO-hackathon.md` to identify the current priority and task ID. 
2. Create a new task boundary using the `task_boundary` tool, setting the `TaskName` and initial `TaskStatus`.
3. Update `task.md` with the specific steps for the implementation. 
4. Research the existing codebase to understand dependencies and patterns.
5. Create an `implementation_plan.md` artifact detailing the proposed changes and getting user approval via `notify_user`.
6. Once approved, execute the changes:
   - Follow the tech stack: Next.js 14 (App Router), TailwindCSS, framer-motion, Anchor/Solana.
   - Use the **Model Selection Guide** for specific tasks (Gemini for UI, Claude for Logic).
7. Verify the changes:
   - Run `pnpm dev` and use the browser tool to check UI.
   - Run tests if applicable (`vitest`).
8. Create a `walkthrough.md` artifact with proof of work (screenshots/recordings).
9. Update `traction/CHECKLIST.md` and `traction/TODO-hackathon.md` with completion status.
10. Notify the user with a summary of the work.