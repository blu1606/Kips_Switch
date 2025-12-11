/**
 * Timer Intent Parser API
 * Phase 9.3: Natural Language Timer Parsing
 * 
 * POST /api/ai/parse-timer
 * Converts natural language duration input into seconds
 * Example: "3 months" -> 7776000
 */

import { NextRequest, NextResponse } from 'next/server';
import { generate } from '@/lib/ai';

export const runtime = 'edge';

interface ParseTimerRequest {
    input: string;
}

import { TIMER_PARSING_PROMPT } from '@/lib/ai/prompts';

const SYSTEM_PROMPT = TIMER_PARSING_PROMPT;

export async function POST(request: NextRequest) {
    try {
        const body: ParseTimerRequest = await request.json();

        if (!body.input || body.input.length > 100) {
            return NextResponse.json(
                { error: 'Invalid input. Please keep it under 100 characters.' },
                { status: 400 }
            );
        }

        const prompt = `Parse this duration: "${body.input}"`;

        const result = await generate(prompt, {
            systemPrompt: SYSTEM_PROMPT,
            maxTokens: 100,
            temperature: 0.1, // Low temperature for consistent math
        });

        if (result.provider === 'none') {
            return NextResponse.json(
                { error: 'AI service unavailable' },
                { status: 503 }
            );
        }

        // Parse JSON from AI response
        try {
            // Robust extraction: Find first '{' and last '}'
            const jsonMatch = result.text.match(/\{[\s\S]*\}/);
            const jsonStr = jsonMatch ? jsonMatch[0] : result.text.replace(/```json|```/g, '').trim();
            const parsed = JSON.parse(jsonStr);
            return NextResponse.json({
                ...parsed,
                provider: result.provider,
                latency: result.latency
            });
        } catch {
            console.error('[API] JSON parse failed:', result.text);
            return NextResponse.json(
                { seconds: 0, error: 'Failed to parse AI response' },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error('[API] parse-timer error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
