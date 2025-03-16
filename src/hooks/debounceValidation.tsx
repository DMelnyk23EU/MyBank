import { useState, useEffect, useRef } from 'react';

function useDebouncedValidation<T>(
  validate: (value: T) => boolean, // Validation function
  value: T, // Value to be validated
  errorMessage: string, // Error message to be displayed
  debounceDelay: number = 1000 // Debounce delay in milliseconds,
): string | undefined {
  const [error, setError] = useState<string | undefined>(undefined);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(() => {
      if (value && !validate(value)) {
        setError(errorMessage); // Set the error message
      } else {
        setError(undefined); // No error if the value is valid
      }
    }, debounceDelay); // Apply debounce delay

    return () => {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current); // Cleanup timeout on unmount or value change
    };
  }, [value, debounceDelay, errorMessage, validate]); // Dependencies

  return error;
}

export default useDebouncedValidation;
