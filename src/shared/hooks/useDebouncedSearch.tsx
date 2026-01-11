import { useState, useEffect, useRef } from 'react';

export function useDebouncedSearch(apiFunction: any, delay = 300) {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] =  useState<string | null>(null);
  
  // Store the AbortController for the current request
  const abortControllerRef = useRef<AbortController | null>(null);;

  const search = async (query: string) => {
    // Cancel the previous request if it exists
    if (abortControllerRef.current?.abort) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();
    
    if (!query || query.trim() === '') {
      setResults(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiFunction(query, {
        signal: abortControllerRef.current.signal
      });
      setResults(data);
    } catch (err) {
      // Only set error if it's not an abort error
      if (err instanceof Error) {
        if (err.name !== 'AbortError') {
          setError(err.message);
          console.error('Search error:', err);
        }
      } else {
        setError('An unexpected error occurred');
        console.error('Unknown error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { results, loading, error, search };
}