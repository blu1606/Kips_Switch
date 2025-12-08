/**
 * IPFS integration via Pinata API
 * Upload and fetch encrypted data from IPFS
 */

const PINATA_API_URL = 'https://api.pinata.cloud';
const PINATA_GATEWAY = 'https://gateway.pinata.cloud/ipfs';

/**
 * Get Pinata JWT from environment
 */
function getPinataJWT(): string {
    const jwt = process.env.NEXT_PUBLIC_PINATA_JWT;
    if (!jwt) {
        throw new Error('NEXT_PUBLIC_PINATA_JWT is not configured');
    }
    return jwt;
}

/**
 * Upload encrypted blob to IPFS via Pinata
 * @param encryptedBlob - The encrypted data blob
 * @param fileName - Optional filename for the pin
 * @returns IPFS CID (Content Identifier)
 */
export async function uploadToIPFS(
    encryptedBlob: Blob,
    fileName: string = 'encrypted-vault.bin'
): Promise<string> {
    const jwt = getPinataJWT();

    const formData = new FormData();
    formData.append('file', encryptedBlob, fileName);

    // Add pinata metadata
    const metadata = JSON.stringify({
        name: fileName,
        keyvalues: {
            app: 'deadmans-switch',
            uploadedAt: new Date().toISOString(),
        },
    });
    formData.append('pinataMetadata', metadata);

    // Pin options
    const options = JSON.stringify({
        cidVersion: 1,
    });
    formData.append('pinataOptions', options);

    const response = await fetch(`${PINATA_API_URL}/pinning/pinFileToIPFS`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${jwt}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Pinata upload failed: ${error}`);
    }

    const result = await response.json();
    return result.IpfsHash; // CID
}

/**
 * Upload JSON data to IPFS
 * Useful for metadata or small encrypted payloads
 */
export async function uploadJSONToIPFS(
    data: object,
    name: string = 'vault-data.json'
): Promise<string> {
    const jwt = getPinataJWT();

    const response = await fetch(`${PINATA_API_URL}/pinning/pinJSONToIPFS`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${jwt}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            pinataContent: data,
            pinataMetadata: {
                name,
                keyvalues: {
                    app: 'deadmans-switch',
                },
            },
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Pinata JSON upload failed: ${error}`);
    }

    const result = await response.json();
    return result.IpfsHash;
}

/**
 * Fetch data from IPFS by CID
 * @param cid - IPFS Content Identifier
 * @returns Blob of the fetched data
 */
export async function fetchFromIPFS(cid: string): Promise<Blob> {
    const response = await fetch(`${PINATA_GATEWAY}/${cid}`, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch from IPFS: ${response.statusText}`);
    }

    return response.blob();
}

/**
 * Fetch JSON data from IPFS
 */
export async function fetchJSONFromIPFS<T = unknown>(cid: string): Promise<T> {
    const response = await fetch(`${PINATA_GATEWAY}/${cid}`, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch JSON from IPFS: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Check if a CID exists and is accessible
 */
export async function checkIPFSAvailability(cid: string): Promise<boolean> {
    try {
        const response = await fetch(`${PINATA_GATEWAY}/${cid}`, {
            method: 'HEAD',
        });
        return response.ok;
    } catch {
        return false;
    }
}

/**
 * Get public IPFS URL for a CID
 */
export function getIPFSUrl(cid: string): string {
    return `${PINATA_GATEWAY}/${cid}`;
}

/**
 * Unpin content from Pinata (optional cleanup)
 */
export async function unpinFromIPFS(cid: string): Promise<void> {
    const jwt = getPinataJWT();

    const response = await fetch(`${PINATA_API_URL}/pinning/unpin/${cid}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${jwt}`,
        },
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to unpin: ${error}`);
    }
}

// ============================================================================
// RETRY WRAPPER
// ============================================================================

/**
 * Retry wrapper for IPFS operations
 */
export async function withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000
): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error as Error;
            console.warn(`Attempt ${attempt}/${maxRetries} failed:`, error);

            if (attempt < maxRetries) {
                await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
            }
        }
    }

    throw lastError;
}

/**
 * Upload with automatic retry
 */
export async function uploadToIPFSWithRetry(
    encryptedBlob: Blob,
    fileName?: string
): Promise<string> {
    return withRetry(() => uploadToIPFS(encryptedBlob, fileName));
}

/**
 * Fetch with automatic retry
 */
export async function fetchFromIPFSWithRetry(cid: string): Promise<Blob> {
    return withRetry(() => fetchFromIPFS(cid));
}
