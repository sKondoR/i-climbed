'use client'

import { useEffect, useState } from 'react';

export default function ClientOnly({ className, style, children }:
    { className?: string; style?: React.CSSProperties; children: React.ReactNode }
) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
  }, []);

  return isClient ? <div className={className} style={style}>{children}</div> : <span />; // или <noscript />
}