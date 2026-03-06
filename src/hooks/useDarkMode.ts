import { useEffect, useState } from 'react';

export function useDarkMode() {
    const [isDark, setIsDark] = useState(() => {
        // On first load: check localStorage, default to dark
        const stored = localStorage.getItem('theme');
        if (stored) return stored === 'dark';
        return true; // dark by default
    });

    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    return { isDark, toggle: () => setIsDark(prev => !prev) };
}
