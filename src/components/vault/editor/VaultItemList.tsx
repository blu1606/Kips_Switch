import { FC } from 'react';
import { VaultItem } from '@/types/vaultBundle';
import { getItemIcon, formatFileSize } from '@/utils/vaultBundle';

interface VaultItemListProps {
    items: VaultItem[];
    readOnly?: boolean;
    onRemove: (id: string) => void;
    onDownload: (item: VaultItem) => void;
}

export const VaultItemList: FC<VaultItemListProps> = ({
    items,
    readOnly = false,
    onRemove,
    onDownload
}) => {
    if (items.length === 0) return null;

    return (
        <div className="space-y-2">
            {items.map((item) => (
                <div
                    key={item.id}
                    className="flex items-center gap-3 bg-dark-800 rounded-lg p-3 border border-dark-700 hover:border-dark-600 transition-colors"
                >
                    <span className="text-xl">{getItemIcon(item.type)}</span>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{item.name}</p>
                        <p className="text-xs text-dark-500">
                            {item.type} • {formatFileSize(item.size)}
                        </p>
                    </div>
                    {!readOnly && (
                        <button
                            onClick={() => onRemove(item.id)}
                            className="text-dark-500 hover:text-red-400 transition-colors p-1 rounded-md hover:bg-dark-700"
                            title="Remove item"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                    {readOnly && (
                        <button
                            onClick={() => onDownload(item)}
                            className="text-primary-400 hover:text-primary-300 transition-colors p-1 rounded-md hover:bg-dark-700"
                            title="Download item"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};
