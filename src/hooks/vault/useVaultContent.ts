import { useState, useRef } from 'react';
import { VaultItem, BUNDLE_LIMITS } from '@/types/vaultBundle';
import { fileToVaultItem, textToVaultItem } from '@/utils/vaultBundle';

interface UseVaultContentProps {
    items: VaultItem[];
    onItemsChange: (items: VaultItem[]) => void;
    maxItems: number;
}

export function useVaultContent({ items, onItemsChange, maxItems }: UseVaultContentProps) {
    const [isAddingText, setIsAddingText] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [textName, setTextName] = useState('');
    const [textContent, setTextContent] = useState('');
    const [error, setError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const totalSize = items.reduce((sum, i) => sum + i.size, 0);
    const canAddMore = items.length < maxItems && totalSize < BUNDLE_LIMITS.maxTotalSize;

    const handleAddText = () => {
        if (!textContent.trim()) return;

        const name = textName.trim() || 'Note';
        const item = textToVaultItem(name, textContent);
        onItemsChange([...items, item]);

        setTextName('');
        setTextContent('');
        setIsAddingText(false);
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        setError(null);

        for (const file of Array.from(files)) {
            if (items.length >= maxItems) {
                setError(`Maximum ${maxItems} items allowed`);
                break;
            }

            try {
                const item = await fileToVaultItem(file);
                onItemsChange([...items, item]);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to process file');
            }
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleRecordingComplete = async (blob: Blob) => {
        setIsRecording(false);
        setError(null);

        try {
            const file = new File([blob], `Recording_${Date.now()}.webm`, { type: blob.type || 'audio/webm' });
            const item = await fileToVaultItem(file);
            onItemsChange([...items, item]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save recording');
        }
    };

    const handleRemove = (id: string) => {
        onItemsChange(items.filter(i => i.id !== id));
    };

    return {
        // State
        isAddingText,
        setIsAddingText,
        isRecording,
        setIsRecording,
        textName,
        setTextName,
        textContent,
        setTextContent,
        error,
        setError,
        fileInputRef,

        // Derived
        totalSize,
        canAddMore,

        // Actions
        handleAddText,
        handleFileSelect,
        handleRecordingComplete,
        handleRemove
    };
}
