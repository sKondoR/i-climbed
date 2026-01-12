import { useState, useEffect, useRef } from 'react';
import type { FoundResults } from '../types/SearchResults';

const initSearchValue = {
  places: [],
  sectors: [],
  routes: [],
};

export function useDebouncedSearch(apiFunction: (query: string, options?: any) => Promise<FoundResults>, delay = 300) {
  const [results, setResults] = useState<FoundResults>(initSearchValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const search = (query: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

     console.log('>0 true ', query)
    setLoading(true);
    setError(null);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (!query || query.trim().length < 3) {
      setResults(initSearchValue);
      console.log('>1 false ', query)
      setLoading(false);
      return;
    }

    timeoutRef.current = setTimeout(async () => {
      abortControllerRef.current = new AbortController();

      try {
        const data = await apiFunction(query, {
          signal: abortControllerRef.current.signal,
        });
        setResults(data);
        setLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          if (err.name !== 'AbortError') {
            setError(err.message);
            setLoading(false);
            console.error('Search error:', err);
          }
        } else {
          setError('An unexpected error occurred');
          console.error('Unknown error:', err);
        }
      } finally {
      }
    }, delay);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { results, loading, error, search };
}
