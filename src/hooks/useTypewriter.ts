import { useState, useEffect } from 'react';

export const useTypewriter = (text: string, speed: number = 20) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        if (!text) {
            setDisplayedText('');
            return;
        }

        setIsTyping(true);
        setDisplayedText('');
        let index = 0;

        const interval = setInterval(() => {
            if (index < text.length) {
                setDisplayedText(text.slice(0, index + 1));
                index++;
            } else {
                setIsTyping(false);
                clearInterval(interval);
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed]);

    return { displayedText, isTyping };
};
