/**
 * Manual Test Script for Solana Blinks API
 * 
 * Usage: npx ts-node scripts/test-blinks.ts
 */

const API_URL = 'http://localhost:3000/api/actions/ping';

// Test wallet address - replace with your own
const TEST_WALLET = process.env.TEST_WALLET || '11111111111111111111111111111111';

async function testGetEndpoint() {
    console.log('\n📍 Testing GET /api/actions/ping...\n');

    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        console.log('✅ Status:', response.status);
        console.log('📦 Response:');
        console.log(JSON.stringify(data, null, 2));

        // Validate response structure
        const requiredFields = ['icon', 'title', 'description', 'label'];
        const missingFields = requiredFields.filter(f => !data[f]);

        if (missingFields.length > 0) {
            console.log('\n⚠️ Missing required fields:', missingFields);
        } else {
            console.log('\n✅ All required fields present!');
        }
    } catch (error) {
        console.error('❌ GET Error:', error);
    }
}

async function testPostEndpoint(walletAddress: string) {
    console.log('\n📍 Testing POST /api/actions/ping...\n');
    console.log('🔑 Wallet:', walletAddress);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ account: walletAddress }),
        });

        const data = await response.json();

        console.log('✅ Status:', response.status);
        console.log('📦 Response:');
        console.log(JSON.stringify(data, null, 2));

        if (data.transaction) {
            console.log('\n✅ Transaction created successfully!');
            console.log('📝 Transaction length:', data.transaction.length, 'bytes (base64)');
        } else if (data.error) {
            console.log('\n⚠️ Expected error (no vaults):', data.error);
        }
    } catch (error) {
        console.error('❌ POST Error:', error);
    }
}

async function main() {
    console.log('═══════════════════════════════════════');
    console.log('  🧪 Solana Blinks API Test Suite');
    console.log('═══════════════════════════════════════');

    // Test GET
    await testGetEndpoint();

    // Test POST
    await testPostEndpoint(TEST_WALLET);

    console.log('\n═══════════════════════════════════════');
    console.log('  📋 Test Complete');
    console.log('═══════════════════════════════════════\n');
}

main();
