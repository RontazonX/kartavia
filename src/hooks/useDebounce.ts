import { useState, useEffect } from 'react';

/**
 * A highly efficient custom hook to debounce high-frequency state updates,
 * such as search inputs or real-time filtering, to prevent excessive 
 * API calls to Supabase or unnecessary re-renders.
 * 
 * @param value The value to debounce
 * @param delay The delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timer to update the debounced value after the specified delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if the value changes before the delay has passed.
    // This is the core logic that prevents execution until the user stops typing.
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
