import { useState, useEffect } from "react";

// A small useState wrapper that persists its value to localStorage so that
// favorites and theme survive page reloads.
export const useLocalStorage = (key, initialValue) => {
    const [value, setValue] = useState(() => {
        try {
            const stored = window.localStorage.getItem(key);
            return stored !== null ? JSON.parse(stored) : initialValue;
        } catch {
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch {
            // Storage may be full or unavailable (private mode) — ignore.
        }
    }, [key, value]);

    return [value, setValue];
};
