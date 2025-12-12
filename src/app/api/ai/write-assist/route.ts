import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Fail-fast if API key is missing
const API_KEY = process.env.GOOGLE_AI_API_KEY;

export const runtime = 'edge'; // Use Edge Runtime for speed

export async function POST(req: NextRequest) {
    if (!API_KEY) {
        return NextResponse.json(
            { error: 'Server configuration error: Missing AI Key' },
            { status: 500 }
        );
    }

    try {
        const { relation, sentiment, tone } = await req.json();

        if (!relation || !sentiment) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `
            You are a specialized ghostwriter for "Deadman's Switch" legacy messages. These are final messages sent to loved ones after the user has passed away.
            
            Task: Write a short, authentic draft message based on the following inputs.
            
            Recipient Relation: ${relation}
            Key Memory/Sentiment: ${sentiment}
            Desired Tone: ${tone || 'Sentimental'}
            
            Constraints:
            - Keep it under 150 words.
            - Do not use placeholders like [Name].
            - Be empathetic but natural.
            - Output ONLY the message text, no "Here is a draft:" preambles.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const draft = response.text().trim();

        return NextResponse.json({ draft });

    } catch (error) {
        console.error('[WriteAssist] Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate draft' },
            { status: 500 }
        );
    }
}
