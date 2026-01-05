
import type { JSX } from 'react';
export default function PageDescription({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
    return (
        <div className="ml-30 flex mb-3 min-h-10">
            {children}
        </div>
    )
}