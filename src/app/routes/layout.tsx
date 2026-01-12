import type { Metadata } from "next";
import { Climber } from "../ui/Climber";
import AnimatedTitle from "../(home)/ui/AnimatedTitle/AnimatedTitle";
import { HeaderPanel } from "@/shared/ui/HeaderPanel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Отметь Allclimb трассу",
  description: "Отметь Allclimb трассу",
};

export default function RoutesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="m-auto sm:w-full md:w-3/4 max-w-4xl relative">
      <AnimatedTitle>Отметь<br />Allclimb<br />трассу</AnimatedTitle>
      <HeaderPanel>
        <Link href="/" className="ml-60 text-3xl text-white hover:text-pink-700">
          <FontAwesomeIcon
              icon={faHome}     
          /> 
        </Link>
      </HeaderPanel>
      <Climber />
      <div className="bg-white/60 backdrop-blur-md rounded-sm shadow-2xl transition-all duration-300 hover:shadow-3xl relative z-2">
        <div className="border-white/30 rounded-sm py-4 px-3 md:px-6 md:py-6 hover:border-white/50 transition-colors overflow-hidden">
          {children}
        </div>
      </div>
    </div> 
  );
}
