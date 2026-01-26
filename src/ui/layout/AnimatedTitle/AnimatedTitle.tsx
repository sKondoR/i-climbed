import Link from "next/link";
import AnimatedTitleColored from "./AnimatedTitleColored";
import { HOME } from "@/shared/constants/search.constants";

export default function AnimatedTitle({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <Link
        href={HOME}
        className={`
          font-mono font-bold leading-[0.8]
          bg-cover bg-center
          text-transparent select-none
          text-3xl md:text-6xl
          absolute z-10

          left-[10px] top-[-2px]

          md:left-[-82px] md:top-[-24px]
        `}
      >
        <AnimatedTitleColored>
          {children}
        </AnimatedTitleColored>
        {children}
      </Link>
  );
}
