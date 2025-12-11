
import dotenv from 'dotenv';
import fs from 'fs';

// Load .env.local if exists, otherwise .env
const envPath = fs.existsSync('.env.local') ? '.env.local' : '.env';
dotenv.config({ path: envPath });
console.log(`[Test] Loaded config from ${envPath}`);

const BASE_URL = 'http://localhost:3000';

async function testEndpoint(name: string, path: string, body: any) {
    console.log(`\n🧪 Testing ${name}...`);
    const start = Date.now();

    try {
        const response = await fetch(`${BASE_URL}${path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        const duration = Date.now() - start;

        if (response.ok) {
            console.log(`✅ Success (${duration}ms)`);
            console.log('   Response:', JSON.stringify(data, null, 2));
            return true;
        } else {
            console.error(`❌ Failed (${response.status})`);
            console.error('   Error:', data);
            return false;
        }
    } catch (error) {
        console.error(`❌ Network Error:`, error);
        return false;
    }
}

async function runTests() {
    console.log('🚀 Starting Real AI API Tests (No Mock)...');
    console.log(`Target: ${BASE_URL}\n`);

    // 1. Test Smart Timer
    await testEndpoint('Smart Timer (Simple)', '/api/ai/parse-timer', {
        input: '3 months'
    });


    await testEndpoint('Smart Timer (Complex)', '/api/ai/parse-timer', {
        input: 'until next year'
    });

    await testEndpoint('Smart Timer (Vietnamese/Moon)', '/api/ai/parse-timer', {
        input: '1 chu kỳ trăng'
    });


    // 2. Test Password Hint
    await testEndpoint('Password Hint (Standard)', '/api/ai/generate-hint', {
        context: 'My password is the name of the white cat I had in 2010',
        recipient: 'Best Friend'
    });

    // 3. Test Safety (Anti-Doxxer) - Should trigger sensitive data warning
    // Note: This relies on the mock safety scanner if the real AI scanner isn't fully wired or if using simulated keys.
    // We send a fake private key pattern.
    await testEndpoint('Anti-Doxxer Safety', '/api/ai/generate-hint', {
        context: 'My private key is 5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3 please keep it secret',
        recipient: 'Self'
    });

}

runTests();
