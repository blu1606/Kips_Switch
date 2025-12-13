'use client';

import { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClaimedVaultRecord } from '@/hooks/useClaimedVaults';
import { formatDate, truncateAddress } from '@/lib/utils';
import { getItemIcon, formatFileSize } from '@/utils/vaultBundle';
import { VaultItemType } from '@/types/vaultBundle';

interface ClaimedVaultCardProps {
    vault: ClaimedVaultRecord;
    onView: () => void;
    onExport: () => void;
    onDelete?: () => void;
    index?: number;
    viewMode?: 'grid' | 'list';
}

const ClaimedVaultCard: FC<ClaimedVaultCardProps> = ({
    vault,
    onView,
    onExport,
    onDelete,
    index = 0,
    viewMode = 'grid'
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Get unique content types for display
    const uniqueTypes = Array.from(new Set(vault.contentSummary.types));

    // Card animation variants
    const cardVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                delay: Math.min(index * 0.1, 0.5), // Cap delay at 0.5s
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94] as const
            }
        },
        exit: {
            opacity: 0,
            scale: 0.9,
            transition: { duration: 0.2 }
        }
    };

    if (viewMode === 'list') {
        return (
            <motion.div
                layout
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group relative overflow-hidden rounded-xl bg-dark-900/40 backdrop-blur-xl border border-white/10 hover:border-primary-500/30 transition-all duration-300"
                style={{
                    boxShadow: isHovered
                        ? '0 0 40px rgba(99, 102, 241, 0.15), inset 0 0 20px rgba(99, 102, 241, 0.05)'
                        : '0 0 0px transparent'
                }}
            >
                <div className="flex items-center gap-4 p-4">
                    {/* Icon */}
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-primary-500/20">
                        <span className="text-2xl">{uniqueTypes[0] ? getItemIcon(uniqueTypes[0] as VaultItemType) : '📦'}</span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white group-hover:text-primary-400 transition-colors truncate">
                            {vault.name}
                        </h3>
                        <p className="text-xs text-dark-400 truncate">
                            From: {vault.senderName || truncateAddress(vault.senderAddress)}
                        </p>
                    </div>

                    {/* Meta */}
                    <div className="text-right hidden sm:block">
                        <p className="text-sm text-dark-300">{formatFileSize(vault.contentSummary.totalSize)}</p>
                        <p className="text-xs text-dark-500">{formatDate(new Date(vault.claimedAt))}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                        <button
                            onClick={onView}
                            aria-label={`View vault ${vault.name}`}
                            className="px-4 py-2 bg-primary-500/10 hover:bg-primary-500/20 text-primary-400 text-sm rounded-lg transition-colors border border-primary-500/20"
                        >
                            Open
                        </button>
                        <button
                            onClick={onExport}
                            aria-label={`Export vault ${vault.name}`}
                            className="p-2 bg-dark-800/80 hover:bg-dark-700 text-dark-400 hover:text-white rounded-lg transition-colors"
                            title="Export"
                        >
                            ⬇️
                        </button>
                        {onDelete && (
                            <AnimatePresence>
                                {showDeleteConfirm ? (
                                    <motion.button
                                        key="list-confirm"
                                        initial={{ width: 0, opacity: 0, overflow: 'hidden' }}
                                        animate={{ width: 'auto', opacity: 1 }}
                                        exit={{ width: 0, opacity: 0 }}
                                        onClick={() => {
                                            onDelete();
                                            setShowDeleteConfirm(false);
                                        }}
                                        className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors border border-red-500/30 whitespace-nowrap text-sm"
                                    >
                                        Confirm
                                    </motion.button>
                                ) : (
                                    <motion.button
                                        key="list-delete"
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="p-2 bg-dark-800/80 hover:bg-red-500/20 text-dark-500 hover:text-red-400 rounded-lg transition-colors"
                                        title="Remove from Archive"
                                        aria-label="Delete vault"
                                    >
                                        🗑️
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        )}
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            layout
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            whileHover={{ y: -8 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => { setIsHovered(false); setShowDeleteConfirm(false); }}
            className="group relative overflow-hidden rounded-2xl"
        >
            {/* Glassmorphism Card */}
            <div
                className="relative bg-dark-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 transition-all duration-300"
                style={{
                    boxShadow: isHovered
                        ? '0 0 40px rgba(99, 102, 241, 0.2), inset 0 0 30px rgba(99, 102, 241, 0.05)'
                        : '0 4px 20px rgba(0, 0, 0, 0.3)',
                    borderColor: isHovered ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255, 255, 255, 0.1)'
                }}
            >
                {/* Gradient Overlay on Hover */}
                <div
                    className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
                />

                {/* Header */}
                <div className="relative z-10 flex justify-between items-start mb-4">
                    <div className="flex-1 min-w-0 pr-2">
                        <motion.h3
                            className="font-bold text-lg text-white group-hover:text-primary-400 transition-colors truncate"
                            animate={{ x: isHovered ? 4 : 0 }}
                        >
                            {vault.name}
                        </motion.h3>
                        <div className="flex items-center gap-1 mt-1.5">
                            <span className="text-xs text-dark-500">From:</span>
                            <span className="text-xs font-mono text-dark-400 bg-dark-800/80 px-2 py-0.5 rounded truncate max-w-[120px]">
                                {vault.senderName || truncateAddress(vault.senderAddress)}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] text-dark-500 bg-dark-800/80 px-2 py-1 rounded-full">
                            {formatDate(new Date(vault.claimedAt))}
                        </span>
                    </div>
                </div>

                {/* Content Summary - Glassmorphism Box */}
                <div className="relative z-10 bg-dark-800/30 backdrop-blur-sm rounded-xl p-4 mb-4 border border-dark-700/30">
                    {/* Type Icons */}
                    <div className="flex items-center gap-2 mb-3">
                        <div className="flex -space-x-2">
                            {uniqueTypes.slice(0, 4).map((type, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: index * 0.1 + i * 0.1 }}
                                    className="w-8 h-8 rounded-full bg-gradient-to-br from-dark-700 to-dark-800 border-2 border-dark-900 flex items-center justify-center text-sm shadow-lg"
                                    title={type}
                                >
                                    {getItemIcon(type as VaultItemType)}
                                </motion.span>
                            ))}
                            {uniqueTypes.length > 4 && (
                                <span className="w-8 h-8 rounded-full bg-dark-700 border-2 border-dark-900 flex items-center justify-center text-xs text-dark-400 font-medium">
                                    +{uniqueTypes.length - 4}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-dark-400">
                            {vault.contentSummary.itemCount} {vault.contentSummary.itemCount === 1 ? 'item' : 'items'}
                        </span>
                        <span className="text-dark-500 font-mono">
                            {formatFileSize(vault.contentSummary.totalSize)}
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="relative z-10 flex gap-2">
                    <motion.button
                        onClick={onView}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-600/80 to-primary-500/80 hover:from-primary-500 hover:to-primary-400 text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-primary-500/20"
                    >
                        <motion.span
                            animate={{ rotate: isHovered ? 15 : 0 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            👁️
                        </motion.span>
                        Open Memory
                    </motion.button>

                    <button
                        onClick={onExport}
                        className="p-2.5 bg-dark-800/80 hover:bg-dark-700 text-dark-400 hover:text-white rounded-xl transition-colors border border-dark-700/50"
                        title="Export / Download"
                    >
                        ⬇️
                    </button>

                    {onDelete && (
                        <AnimatePresence mode="wait" initial={false}>
                            {showDeleteConfirm ? (
                                <motion.button
                                    key="delete-confirm"
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: 'auto', opacity: 1 }}
                                    exit={{ width: 0, opacity: 0 }}
                                    onClick={() => {
                                        onDelete();
                                        setShowDeleteConfirm(false);
                                    }}
                                    className="p-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-colors border border-red-500/30 whitespace-nowrap"
                                >
                                    Confirm?
                                </motion.button>
                            ) : (
                                <motion.button
                                    key="delete-btn"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="p-2.5 bg-dark-800/80 hover:bg-red-500/20 text-dark-500 hover:text-red-400 rounded-xl transition-colors border border-dark-700/50"
                                    title="Remove from Archive"
                                    aria-label="Delete vault"
                                >
                                    🗑️
                                </motion.button>
                            )}
                        </AnimatePresence>
                    )}
                </div>

                {/* Corner Glow */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
        </motion.div>
    );
};

export default ClaimedVaultCard;
