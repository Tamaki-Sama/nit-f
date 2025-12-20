import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { getSavedValue } from './reader.js';
import { getMaxId } from './calculations.js';
import { formatSecondsToMMSS } from './formatters.js';
export function useTheme(initialValue = false) {
    const [isDarkMode, setIsDarkMode] = useLocalStorage('darkMode', initialValue);

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
        } else {
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-theme');
        }
    }, [isDarkMode]);
    const toggleTheme = () => {
        setIsDarkMode(prevMode => !prevMode);
    };

    const setDarkMode = (value) => {
        setIsDarkMode(value);
    };
    return {
        isDarkMode,        // Current theme state
        toggleTheme,       // Function to toggle theme
        setDarkMode,       // Function to set theme directly
    };
}
export function useLocalStorage(target_string, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        return getSavedValue(target_string, initialValue);
    });
    useEffect(() => {
        try {
            localStorage.setItem(target_string, JSON.stringify(storedValue));
        } catch (error) {
            console.error(`Failed to save ${target_string} to localStorage:`, error);
        }
    }, [target_string, storedValue]);
    return [storedValue, setStoredValue];
}
export function useModal(initialValue = false) {
    const [isOpen, setIsOpen] = useState(initialValue);
    function Open() {
        setIsOpen(true);
    }
    function Close() {
        setIsOpen(false);
    }
    return [ isOpen, Open, Close ];
}
export function useLastId(array) {
    const ref = useRef(getMaxId(array))
    useEffect(()=>{
        ref.current = getMaxId(array)
    }, [array])
    return ref;
}
export function useLogsOfDay(LogData, SelectedDate) {
    const result = useMemo(() => 
        LogData.filter(workout => workout.date === SelectedDate),
     [LogData, SelectedDate])
    return result;
}
export function useTimer(initialInputTime = 60, initialAutoStart = true, initialPlaySound = false) {
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [inputTime, setInputTime] = useState(initialInputTime);
    const [autoStart, setAutoStart] = useState(initialAutoStart);
    const [playSound, setPlaySound] = useState(initialPlaySound);
    const timerRef = useRef(null);
    const audioRef = useRef(null);
    const playAlarmSound = () => {
        const audio = audioRef.current;
        if (playSound){
            if (audio) {
                audio.play().catch(e => {
                    console.error("Error playing audio, probably blocked by browser:", e);
                });
            }
        }
    };
    useEffect(() => {
        if (isActive) {
            timerRef.current = setInterval(() => {
                setSeconds(prevSeconds => {
                    if (prevSeconds <= 1) {
                        clearInterval(timerRef.current);
                        setIsActive(false);
                        playAlarmSound();
                        return inputTime;
                    }
                    return prevSeconds - 1;
                });
            }, 1000);
        } else if (!isActive && seconds !== 0) {
            clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isActive, playAlarmSound]);

    // Sync seconds when inputTime changes
    useEffect(() => {
        setSeconds(inputTime);
    }, [inputTime]);

    // Control functions
    const start = () => setIsActive(true);
    const stop = () => setIsActive(false);
    const reset = () => {
        setIsActive(false);
        setSeconds(inputTime);
    };
    const toggle = () => setIsActive(prev => !prev);

    return {
        // State
        seconds,
        isActive,
        inputTime,
        autoStart,
        playSound,
        
        // Setters
        setSeconds,
        setIsActive,
        setInputTime,
        setAutoStart,
        setPlaySound,
        
        // Refs (for audio element and interval cleanup)
        timerRef,
        audioRef,
        
        // Control functions
        start,
        stop,
        reset,
        toggle,
        playAlarmSound,
        
        // Helper (for display)
        formattedTime: formatSecondsToMMSS(seconds),
    };
}