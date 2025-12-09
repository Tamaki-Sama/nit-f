export function getSavedValue(target, init) {
    try {
        const item = localStorage.getItem(target);
        if (item) {
            return JSON.parse(item);
        }
    } catch (error) {
        console.error(`Error reading ${target} from localStorage:`, error);
        // Optionally clear corrupted data
        localStorage.removeItem(target);
    }
    const debouncedSave = useMemo(
        () => debounce((data) => {
            try {
                localStorage.setItem('LogData', JSON.stringify(data));
            } catch (error) {
                console.error('Failed to save:', error);
            }
        }, 500),
        []
    );
    
    useEffect(() => {
        debouncedSave(LogData);
    }, [LogData, debouncedSave]);
    return init;
}