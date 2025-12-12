import { FC } from 'react';
import { BUNDLE_LIMITS } from '@/types/vaultBundle';

interface NoteEditorProps {
    title: string;
    content: string;
    onTitleChange: (value: string) => void;
    onContentChange: (value: string) => void;
    onSave: () => void;
    onCancel: () => void;
    onSecurityScan: (text: string, field: string) => void;
    onOpenWriteAssist: () => void;
}

export const NoteEditor: FC<NoteEditorProps> = ({
    title,
    content,
    onTitleChange,
    onContentChange,
    onSave,
    onCancel,
    onSecurityScan,
    onOpenWriteAssist
}) => {
    return (
        <div className="bg-dark-800 rounded-lg p-4 border border-dark-700 space-y-3 animate-fade-in-up">
            <input
                type="text"
                placeholder="Note title"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                onBlur={(e) => onSecurityScan(e.target.value, 'Note Title')}
                className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white text-sm focus:border-primary-500 transition-colors"
                maxLength={50}
                autoFocus
            />

            <div className="flex justify-between items-center px-1">
                <label className="text-xs text-dark-400">Content</label>
                <button
                    onClick={onOpenWriteAssist}
                    className="text-xs flex items-center gap-1.5 text-primary-400 hover:text-primary-300 transition-colors bg-primary-500/10 hover:bg-primary-500/20 px-2 py-1 rounded-md"
                    title="Get AI writing suggestions"
                >
                    <span>✨</span> Help me write
                </button>
            </div>

            <textarea
                placeholder="Write your message..."
                value={content}
                onChange={(e) => onContentChange(e.target.value)}
                onBlur={(e) => onSecurityScan(e.target.value, 'Note Content')}
                className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white text-sm resize-none focus:border-primary-500 transition-colors"
                rows={4}
                maxLength={BUNDLE_LIMITS.maxTextLength}
            />

            <div className="flex gap-2 justify-end">
                <button
                    onClick={onCancel}
                    className="px-3 py-1.5 text-sm text-dark-400 hover:text-white transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={onSave}
                    disabled={!content.trim()}
                    className="px-4 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-lg shadow-primary-500/20"
                >
                    Add Note
                </button>
            </div>
        </div>
    );
};
