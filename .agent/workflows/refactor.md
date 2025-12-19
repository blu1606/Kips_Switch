---
description: analyze recently changed files for "god components", business logic bloat, and violations of CLEAN and SOLID principles.
---

1. Identify recently changed files (e.g., using `git status` or by checking the last modified files in the relevant directories).
2. For each file, perform a code quality audit:
   - **God Components**: Check if a component is too large (e.g., >300 lines) or handles too many responsibilities.
   - **Business Logic Bloat**: Check if UI components contain complex business logic that should be abstracted into hooks or utility services.
   - **SOLID Principles**: 
     - **S**: Does the class/function have more than one reason to change?
     - **O**: Is the logic easy to extend without modification?
     - **L/I/D**: Check for proper interface usage, substitution, and dependency injection/inversion where appropriate (especially in hooks).
   - **CLEAN Code**: Check for meaningful naming, function length, and absence of side effects in pure logic.
3. Document findings:
   - List files that need refactoring with specific reasons. 
   - Propose a refactor strategy (e.g., "Extract logic into `useCustomHook`", "Split `MegaComponent` into smaller sub-components").
4. Create an `implementation_plan.md` for the refactoring work if requested.
5. Execute the refactor and verify with `pnpm run lint` and manual testing.