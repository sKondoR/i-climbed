import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { FoundResults } from '../types/SearchResults';
import { initialSearchResults, MIN_SEARCH_LENGTH } from '../constants/search.constants';

export const useSearch = (searchTerm: string, debounceMs = 1000) => {
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

  const query = useQuery({
    queryKey: ['search', debouncedTerm],
    queryFn: async ({ signal }): Promise<FoundResults> => {
      if (debouncedTerm.trim().length < MIN_SEARCH_LENGTH) return initialSearchResults;

      const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedTerm)}`, {
        signal,
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json()
      return data;
    },
    enabled: debouncedTerm.trim().length >= MIN_SEARCH_LENGTH,
    staleTime: 1000 * 10,
    gcTime: 1000 * 60 * 5,
  });

  return {
    query,
    term: debouncedTerm,
  }
};