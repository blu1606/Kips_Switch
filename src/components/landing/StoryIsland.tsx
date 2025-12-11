'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import KipAvatar from '@/components/brand/KipAvatar';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function StoryIsland() {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const router = useRouter();

    // Track scroll
    useEffect(() => {
        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
            const current = window.scrollY;
            setScrollProgress(current / totalScroll);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Determine current story beat
    const getStoryProperties = () => {
        if (scrollProgress < 0.2) return {
            text: "Hi! I'm Kip. I'll keep your secrets safe.",
            cta: null,
            mood: 'neutral'
        };
        if (scrollProgress < 0.5) return {
            text: "If you go offline... who handles this?",
            cta: "See Problem",
            mood: 'scared'
        };
        if (scrollProgress < 0.8) return {
            text: "I check your heartbeat every 30 days.",
            cta: "How?",
            mood: 'hungry'
        };
        return {
            text: "Let's build your vault now!",
            cta: "Start",
            mood: 'excited'
        };
    };

    const story = getStoryProperties();

    return (
        <motion.div
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, type: "spring" }}
        >
            <motion.div
                className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl flex items-center overflow-hidden cursor-pointer"
                animate={{
                    width: isExpanded ? 'auto' : 'auto',
                    padding: '6px' // Consistent padding
                }}
                layout
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {/* Avatar Always Visible */}
                <div className="relative z-10 shrink-0">
                    <div className="w-10 h-10 rounded-full bg-dark-800 flex items-center justify-center overflow-hidden">
                        <KipAvatar
                            seed="story"
                            size="sm"
                            health={story.mood === 'scared' ? 20 : story.mood === 'excited' ? 100 : 80}
                            isCelebrating={story.mood === 'excited'}
                            showGlow={false}
                            className="scale-75"
                        />
                    </div>
                </div>

                {/* Text Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={story.text}
                        initial={{ opacity: 0, width: 0, x: -10 }}
                        animate={{ opacity: 1, width: 'auto', x: 0 }}
                        exit={{ opacity: 0, width: 0 }}
                        className="flex items-center whitespace-nowrap overflow-hidden"
                    >
                        <div className="px-4 py-1 flex items-center gap-3">
                            <span className="text-sm font-medium text-white">
                                {story.text}
                            </span>

                            {story.cta && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (story.cta === 'Start') router.push('/create');
                                        // Scroll to section logic could go here
                                    }}
                                    className="text-xs bg-primary-600 hover:bg-primary-500 text-white px-3 py-1 rounded-full transition-colors flex items-center gap-1"
                                >
                                    {story.cta}
                                    <ChevronRight className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
}
