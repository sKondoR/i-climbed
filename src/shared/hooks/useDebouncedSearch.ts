import { useState, useEffect, useRef } from 'react';
import type { FoundResults } from '../types/SearchResults.types';
import { initialSearchResults } from '../constants/search.constants';

export function useDebouncedSearch(apiFunction: (query: string, options?: any) => Promise<FoundResults>, delay = 300) {
  const [results, setResults] = useState<FoundResults>(initialSearchResults);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const search = (query: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setLoading(true);
    setError(null);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (!query || query.trim().length < 3) {
      setResults(initialSearchResults);
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
          }
        } else {
          setError('An unexpected error occurred');
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
