/**
 * 10.2 Vault Bundle Types
 * Bundle multiple content items into a single encrypted package
 */

export interface VaultBundle {
    version: 1;
    createdAt: string;
    updatedAt: string;
    items: VaultItem[];
    metadata: {
        totalSize: number;
        itemCount: number;
    };
    // 10.3: For content versioning
    previousCid?: string;
    changelog?: string;
}

export interface VaultItem {
    id: string;
    type: VaultItemType;
    name: string;
    mimeType: string;
    size: number;
    data: string; // base64 encoded
    createdAt: string;
    metadata?: {
        duration?: number; // audio/video duration in seconds
        dimensions?: { width: number; height: number }; // images
    };
}

export type VaultItemType = 'text' | 'file' | 'image' | 'video' | 'audio';

// Limits
export const BUNDLE_LIMITS = {
    maxItems: 20,
    maxFileSize: 50 * 1024 * 1024, // 50MB
    maxTotalSize: 100 * 1024 * 1024, // 100MB
    maxTextLength: 50000, // ~50KB
} as const;
