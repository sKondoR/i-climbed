'use client';
import { useState, useEffect } from 'react';
import useDebounce from '@/shared/hooks/useDebounce';
import { scrapRoutes } from '@/app/actions/scrapRoutes';

export default function SearchForm() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchResults = async (query: string) => {
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const results = await res.json();
    setResults(results || []);
  }

  useEffect(() => {
    if (debouncedQuery) {
      fetchResults(debouncedQuery);
    }
  }, [debouncedQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleScrap= async (e: React.FormEvent) => {
    e.preventDefault();
    scrapRoutes();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="search" className="sr-only">
          Search query
        </label>
        <input
          id="search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your search..."
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
        {loading && <p className="text-sm text-gray-500 mt-1">Searching...</p>}
      </div>
      <button
        type="submit"
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        поиск
      </button>
      <button
        type="button"
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        onClick={handleScrap}
      >
        скачать трассы с Allclimb
      </button>
    </form>
  );
}
