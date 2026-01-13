import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { FoundResults } from '../types/SearchResults.types';

export const useSearch = (searchTerm: string, debounceMs = 1000) => {
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);

  // Debounce the search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

  return useQuery({
    queryKey: ['search', debouncedTerm],
    queryFn: async ({ signal }): Promise<FoundResults | []> => {
      if (!debouncedTerm) return [];

      const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedTerm)}`, {
        signal,
      });

      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    },
    enabled: !!debouncedTerm,
    staleTime: 1000 * 10,
    gcTime: 1000 * 60 * 5,
  });
};