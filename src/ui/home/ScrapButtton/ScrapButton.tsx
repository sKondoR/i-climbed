'use client';

import { useState } from 'react';

export default function ScrapButton() {
  const [loading, setLoading] = useState(false);

  const handleScrap= async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/scrap-routes');
      if (res.ok) {
        console.log('Routes updated successfully!');
      } else {
        const err = await res.json();
        console.log('Error: ' + err.error);
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
        type="button"
        className={`rounded-md px-7 py-2 text-white transition-colors
          focus:outline-none mb-3 border-2 border-white relative z-50
          ${loading ? '' : 'cursor-pointer hover:bg-cyan-800/80'}
        `}
        onClick={handleScrap}
        disabled={loading}
    >
        {loading ? 'Обновление...' : 'обновить данные с Allclimb'}
    </button>
  );
}
