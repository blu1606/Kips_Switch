import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { embed } from 'ai';


// Lazy init to prevent top-level crashes
function getGoogleProvider() {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) throw new Error('GOOGLE_AI_API_KEY missing');
    return createGoogleGenerativeAI({ apiKey });
}

/**
 * Generate a vector embedding for the given text using Google's text-embedding-004 model.
 * Dimensions: 768
 */
export async function generateEmbedding(text: string): Promise<number[]> {
    if (!text) throw new Error('Text is required for embedding generation');

    try {
        const google = getGoogleProvider();
        const { embedding } = await embed({
            model: google.textEmbeddingModel('text-embedding-004'),
            value: text,
        });
        return embedding;
    } catch (error) {
        console.warn('Embedding generation failed (skipping cache):', error);
        // Fail gracefully so the main AI flow doesn't break
        throw error;
    }
}

