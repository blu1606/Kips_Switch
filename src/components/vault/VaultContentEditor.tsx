'use client';

import { FC } from 'react';
import { VaultItem, BUNDLE_LIMITS } from '@/types/vaultBundle';
import { formatFileSize } from '@/utils/vaultBundle';
import VoiceRecorder from './VoiceRecorder';
import { WriteAssistModal } from '@/components/messaging/WriteAssistModal';
import SecurityAlertModal from '@/components/ui/SecurityAlertModal';

// Hooks
import { useVaultContent } from '@/hooks/vault/useVaultContent';
import { useSecurityScanner } from '@/hooks/vault/useSecurityScanner';
import { useWriteAssist } from '@/hooks/vault/useWriteAssist';

// Components
import { VaultItemList } from './editor/VaultItemList';
import { NoteEditor } from './editor/NoteEditor';
import { UploadActions } from './editor/UploadActions';

interface VaultContentEditorProps {
    items: VaultItem[];
    onItemsChange: (items: VaultItem[]) => void;
    maxItems?: number;
    readOnly?: boolean;
}

const VaultContentEditor: FC<VaultContentEditorProps> = ({
    items,
    onItemsChange,
    maxItems = BUNDLE_LIMITS.maxItems,
    readOnly = false
}) => {
    // Logic Hooks
    const content = useVaultContent({ items, onItemsChange, maxItems });
    const scanner = useSecurityScanner();
    const writeAssist = useWriteAssist();

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-dark-300 uppercase tracking-wider">
                    Vault Contents
                </h3>
                <span className="text-xs text-dark-500">
                    {items.length}/{maxItems} items • {formatFileSize(content.totalSize)}
                </span>
            </div>

            {/* Items List */}
            <VaultItemList
                items={items}
                readOnly={readOnly}
                onRemove={content.handleRemove}
                onDownload={(item) => {
                    // Download logic could also be extracted, but keeping inline for now as it needs document API
                    if (!item.data) return;
                    let blob: Blob;
                    if (item.type === 'text') {
                        try {
                            const text = decodeURIComponent(escape(atob(item.data)));
                            blob = new Blob([text], { type: 'text/plain' });
                        } catch {
                            blob = new Blob([item.data], { type: 'text/plain' });
                        }
                    } else {
                        const byteCharacters = atob(item.data);
                        const byteNumbers = new Array(byteCharacters.length);
                        for (let i = 0; i < byteCharacters.length; i++) {
                            byteNumbers[i] = byteCharacters.charCodeAt(i);
                        }
                        const byteArray = new Uint8Array(byteNumbers);
                        blob = new Blob([byteArray], { type: item.mimeType });
                    }
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = item.name;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }}
            />

            {/* Empty State */}
            {items.length === 0 && !content.isAddingText && !content.isRecording && (
                <div className="text-center py-8 border-2 border-dashed border-dark-700 rounded-lg">
                    <p className="text-dark-500 text-sm">No content added yet</p>
                    {!readOnly && <p className="text-dark-600 text-xs mt-1">Add text, files, or recordings below</p>}
                </div>
            )}

            {/* Text Editor */}
            {content.isAddingText && (
                <NoteEditor
                    title={content.textName}
                    content={content.textContent}
                    onTitleChange={content.setTextName}
                    onContentChange={content.setTextContent}
                    onSave={content.handleAddText}
                    onCancel={() => content.setIsAddingText(false)}
                    onSecurityScan={scanner.scanText}
                    onOpenWriteAssist={writeAssist.open}
                />
            )}

            {/* Voice Recorder */}
            {content.isRecording && (
                <div className="bg-dark-800 rounded-lg p-4 border border-red-500/50 space-y-3">
                    <VoiceRecorder onRecordingComplete={content.handleRecordingComplete} />
                    <button
                        onClick={() => content.setIsRecording(false)}
                        className="text-xs text-dark-500 hover:text-dark-300"
                    >
                        Cancel
                    </button>
                </div>
            )}

            {/* Error */}
            {content.error && (
                <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                    {content.error}
                </div>
            )}

            {/* Action Buttons */}
            {content.canAddMore && !content.isAddingText && !content.isRecording && (
                <UploadActions
                    onAddText={() => content.setIsAddingText(true)}
                    onRecord={() => content.setIsRecording(true)}
                    onFileSelect={content.handleFileSelect}
                    fileInputRef={content.fileInputRef}
                />
            )}

            {/* Limit Warning */}
            {!content.canAddMore && (
                <p className="text-xs text-dark-500 text-center">
                    Maximum capacity reached
                </p>
            )}

            {/* Modals */}
            {scanner.securityAlert.result.detected && (
                <SecurityAlertModal
                    isOpen={scanner.securityAlert.isOpen}
                    onClose={scanner.closeAlert}
                    secretType={scanner.securityAlert.result.type!}
                    secretName={scanner.securityAlert.result.name!}
                    suggestion={scanner.securityAlert.result.suggestion!}
                    fieldName={scanner.securityAlert.fieldName}
                    onIgnore={scanner.closeAlert}
                />
            )}

            <WriteAssistModal
                isOpen={writeAssist.isOpen}
                onClose={writeAssist.close}
                onUseDraft={(draft) => {
                    content.setTextContent(draft);
                    writeAssist.close();
                }}
            />
        </div>
    );
};

export default VaultContentEditor;
