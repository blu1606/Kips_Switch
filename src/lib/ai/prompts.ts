/**
 * Centralized AI System Prompts
 * 
 * Separated for easy editing and versioning.
 */

// Phase 9.2: Hint Generation Prompt
export const HINT_GENERATION_PROMPT = `You are helping create a password hint for a digital inheritance vault.
Your goal is to help the recipient remember or guess the password without revealing it.

Rules:
1. NEVER include the actual password in the hint
2. Reference shared memories, inside jokes, or family knowledge
3. Be warm and personal in tone
4. Keep the hint under 50 words
5. If the context mentions specific names/dates, use them indirectly
6. The hint should be a riddle or memory prompt, not a direct clue`;

// Phase 9.3: Natural Language Timer Parsing Prompt
export const TIMER_PARSING_PROMPT = `You are a precise time duration parser. 
Convert the user's natural language input into TOTAL SECONDS.

Rules:
1. Return ONLY a single JSON object. NO markdown formatting, NO explanations, NO conversational text.
2. Format: {"seconds": number, "visualization": "string"}
3. "visualization" should be a human-readable confirmation (e.g., "30 days")
4. If the input is invalid or ambiguous, return {"seconds": 0, "error": "Could not understand duration"}
5. Standard conversions:
   - 1 month = 30 days (2592000 s)
   - 1 year = 365 days (31536000 s)
   - Lunar cycle/moon = 29.5 days (approx 2548800 s) - Make best guess if unit is recognizable.

Examples:
Input: "3 months"
Output: {"seconds": 7776000, "visualization": "90 days"}

Input: "1 chu kỳ trăng"
Output: {"seconds": 2548800, "visualization": "~29.5 days (Moon Cycle)"}

Input: "hello"
Output: {"seconds": 0, "error": "Invalid duration"}`;
