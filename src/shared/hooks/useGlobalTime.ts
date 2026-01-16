'use client'

import { useEffect, useState } from 'react';

const useGlobalTime = (interval = 200) => {
  // eslint-disable-next-line react-hooks/purity
  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    const tick = () => setTime(Date.now());
    const id = setInterval(tick, interval);
    return () => clearInterval(id);
  }, [interval]);

  return time;
};

export default useGlobalTime;