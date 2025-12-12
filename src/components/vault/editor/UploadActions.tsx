import { FC } from 'react';

interface UploadActionsProps {
    onAddText: () => void;
    onRecord: () => void;
    onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
}

export const UploadActions: FC<UploadActionsProps> = ({
    onAddText,
    onRecord,
    onFileSelect,
    fileInputRef
}) => {
    return (
        <div className="flex flex-wrap gap-2">
            <button
                onClick={onAddText}
                className="flex items-center gap-2 px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-dark-300 hover:border-primary-500/50 hover:text-white transition-colors"
                title="Add a text note"
            >
                <span>📝</span> Add Text
            </button>
            <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-dark-300 hover:border-primary-500/50 hover:text-white transition-colors"
                title="Upload files"
            >
                <span>📁</span> Add File
            </button>
            <button
                onClick={onRecord}
                className="flex items-center gap-2 px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-dark-300 hover:border-red-500/50 hover:text-white transition-colors"
                title="Record voice message"
            >
                <span>🎤</span> Record Audio
            </button>
            <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={onFileSelect}
                className="hidden"
                accept="*/*"
            />
        </div>
    );
};
