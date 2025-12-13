'use client';

import { FC, useState } from 'react';
import { motion } from 'framer-motion';

export type SortOption = 'newest' | 'oldest' | 'size' | 'name';
export type FilterType = 'all' | 'notes' | 'audio' | 'files' | 'images';
export type ViewMode = 'grid' | 'list';

interface ArchiveFilterProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    sortBy: SortOption;
    onSortChange: (sort: SortOption) => void;
    filterType: FilterType;
    onFilterChange: (filter: FilterType) => void;
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
}

const FILTER_OPTIONS: { value: FilterType; label: string; icon: string }[] = [
    { value: 'all', label: 'All', icon: '✨' },
    { value: 'notes', label: 'Notes', icon: '📝' },
    { value: 'audio', label: 'Audio', icon: '🎤' },
    { value: 'files', label: 'Files', icon: '📁' },
    { value: 'images', label: 'Images', icon: '🖼️' },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'size', label: 'Largest First' },
    { value: 'name', label: 'Name A-Z' },
];

const ArchiveFilter: FC<ArchiveFilterProps> = ({
    searchQuery,
    onSearchChange,
    sortBy,
    onSortChange,
    filterType,
    onFilterChange,
    viewMode,
    onViewModeChange,
}) => {
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    // Reduced motion check
    const shouldReduceMotion = typeof window !== 'undefined'
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    return (
        <div className="space-y-4 mb-6">
            {/* Search and Sort Row */}
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Search Input */}
                <motion.div
                    className="relative flex-1"
                    animate={{
                        boxShadow: isSearchFocused && !shouldReduceMotion
                            ? '0 0 20px rgba(99, 102, 241, 0.3)'
                            : '0 0 0px rgba(99, 102, 241, 0)'
                    }}
                    style={{ borderRadius: '0.75rem' }}
                >
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                        placeholder="Search by name or sender..."
                        className="w-full pl-12 pr-4 py-3 bg-dark-800/50 border border-dark-700 rounded-xl text-white placeholder:text-dark-500 focus:border-primary-500/50 focus:outline-none transition-colors"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => onSearchChange('')}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-dark-500 hover:text-white transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </motion.div>

                {/* Sort Dropdown */}
                <select
                    value={sortBy}
                    onChange={(e) => onSortChange(e.target.value as SortOption)}
                    aria-label="Sort vaults"
                    className="px-4 py-3 bg-dark-800/50 border border-dark-700 rounded-xl text-white focus:border-primary-500/50 focus:outline-none cursor-pointer min-w-[160px] [&>option]:bg-dark-800 [&>option]:text-white"
                >
                    {SORT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>

                {/* View Mode Toggle */}
                <div className="flex bg-dark-800/50 border border-dark-700 rounded-xl p-1">
                    <button
                        onClick={() => onViewModeChange('grid')}
                        className={`px-3 py-2 rounded-lg transition-colors ${viewMode === 'grid'
                            ? 'bg-primary-500/20 text-primary-400'
                            : 'text-dark-400 hover:text-white'
                            }`}
                        title="Grid View"
                        aria-label="Grid View"
                        aria-pressed={viewMode === 'grid'}
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => onViewModeChange('list')}
                        className={`px-3 py-2 rounded-lg transition-colors ${viewMode === 'list'
                            ? 'bg-primary-500/20 text-primary-400'
                            : 'text-dark-400 hover:text-white'
                            }`}
                        title="List View"
                        aria-label="List View"
                        aria-pressed={viewMode === 'list'}
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Filter Chips - Horizontal Scroll on Mobile */}
            <div className="flex flex-wrap sm:flex-nowrap gap-2 overflow-x-auto scrollbar-hide pb-2 mask-linear">
                {FILTER_OPTIONS.map((opt) => (
                    <motion.button
                        key={opt.value}
                        onClick={() => onFilterChange(opt.value)}
                        whileTap={{ scale: 0.95 }}
                        aria-pressed={filterType === opt.value}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${filterType === opt.value
                            ? 'bg-primary-500/20 text-primary-400 border border-primary-500/50 shadow-lg shadow-primary-500/20'
                            : 'bg-dark-800/50 text-dark-400 border border-dark-700 hover:border-dark-600 hover:text-white'
                            }`}
                    >
                        <span className="mr-1.5">{opt.icon}</span>
                        {opt.label}
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default ArchiveFilter;
