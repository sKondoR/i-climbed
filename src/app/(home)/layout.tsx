import type { Metadata } from "next";
import AnimatedTitle from "./ui/AnimatedTitle/AnimatedTitle";
import { SearchTabs } from "./ui/SearchTabs";
import { Climber } from "../ui/Climber";
import { HeaderPanel } from "@/shared/ui/HeaderPanel";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Поиск по имени трассы на Allclimb",
  description: "Поиск по имени трассы на Allclimb",
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="m-auto sm:w-full md:w-3/4 max-w-4xl relative">
      <AnimatedTitle>Поиск<br />Allclimb<br />трасс</AnimatedTitle>
      <HeaderPanel>
        <SearchTabs />
      </HeaderPanel>      
      <Climber />
      <div className="bg-white/60 backdrop-blur-md rounded-sm shadow-2xl transition-all duration-300 hover:shadow-3xl relative z-2">
        <div className="border-white/30 rounded-sm py-4 px-3 md:px-6 md:py-6 hover:border-white/50 transition-colors overflow-hidden">
          <Suspense fallback={<div></div>}>
            {children}
          </Suspense>
        </div>
      </div>
    </div> 
  );
}
