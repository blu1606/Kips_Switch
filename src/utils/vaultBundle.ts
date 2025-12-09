/**
 * 10.2 Vault Bundle Utilities
 */

import { VaultBundle, VaultItem, VaultItemType, BUNDLE_LIMITS } from '@/types/vaultBundle';

export function createEmptyBundle(): VaultBundle {
    const now = new Date().toISOString();
    return {
        version: 1,
        createdAt: now,
        updatedAt: now,
        items: [],
        metadata: { totalSize: 0, itemCount: 0 },
    };
}

export function addItemToBundle(bundle: VaultBundle, item: Omit<VaultItem, 'id' | 'createdAt'>): VaultBundle {
    const newItem: VaultItem = {
        ...item,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
    };

    const items = [...bundle.items, newItem];
    return {
        ...bundle,
        updatedAt: new Date().toISOString(),
        items,
        metadata: {
            totalSize: items.reduce((sum, i) => sum + i.size, 0),
            itemCount: items.length,
        },
    };
}

export function removeItemFromBundle(bundle: VaultBundle, itemId: string): VaultBundle {
    const items = bundle.items.filter(i => i.id !== itemId);
    return {
        ...bundle,
        updatedAt: new Date().toISOString(),
        items,
        metadata: {
            totalSize: items.reduce((sum, i) => sum + i.size, 0),
            itemCount: items.length,
        },
    };
}

export function getItemType(mimeType: string): VaultItemType {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.startsWith('text/')) return 'text';
    return 'file';
}

export async function fileToVaultItem(file: File): Promise<VaultItem> {
    return new Promise((resolve, reject) => {
        if (file.size > BUNDLE_LIMITS.maxFileSize) {
            reject(new Error(`File too large. Max: ${BUNDLE_LIMITS.maxFileSize / 1024 / 1024}MB`));
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const base64 = (reader.result as string).split(',')[1];
            resolve({
                id: crypto.randomUUID(),
                type: getItemType(file.type),
                name: file.name,
                mimeType: file.type || 'application/octet-stream',
                size: file.size,
                data: base64,
                createdAt: new Date().toISOString(),
            });
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

export function textToVaultItem(name: string, content: string): VaultItem {
    const data = btoa(unescape(encodeURIComponent(content)));
    return {
        id: crypto.randomUUID(),
        type: 'text',
        name,
        mimeType: 'text/plain',
        size: new Blob([content]).size,
        data,
        createdAt: new Date().toISOString(),
    };
}

export function bundleToBlob(bundle: VaultBundle): Blob {
    return new Blob([JSON.stringify(bundle)], { type: 'application/json' });
}

export function blobToBundle(blob: Blob): Promise<VaultBundle> {
    return blob.text().then(JSON.parse);
}

export function validateBundle(bundle: VaultBundle): string | null {
    if (bundle.items.length > BUNDLE_LIMITS.maxItems) {
        return `Too many items. Max: ${BUNDLE_LIMITS.maxItems}`;
    }
    if (bundle.metadata.totalSize > BUNDLE_LIMITS.maxTotalSize) {
        return `Total size too large. Max: ${BUNDLE_LIMITS.maxTotalSize / 1024 / 1024}MB`;
    }
    return null;
}

export function getItemIcon(type: VaultItemType): string {
    switch (type) {
        case 'text': return '📝';
        case 'image': return '🖼️';
        case 'video': return '🎬';
        case 'audio': return '🎤';
        default: return '📄';
    }
}

export function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
