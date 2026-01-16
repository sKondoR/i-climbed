import { AnimatedBg } from '@/ui/layout/AnimatedBg';
import { ScrapButton } from '@/ui/home/ScrapButtton';
import Providers from './providers';
import ScrapStats from '@/ui/layout/ScrapStats';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        <Providers>
          <AnimatedBg />
          <div
            className="fixed h-screen inset-0 -z-2 bg-cover bg-center bg-fixed opacity-30"
            style={{
              backgroundImage: "url('/images/bg5.jpg')", 
            }}
          ></div>
          <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-10 left-20 w-32 h-32 rounded-full bg-white/10 ipulse" style={{ animationDelay: '0s' }}></div>
              <div className="absolute top-2/3 right-1/4 w-24 h-24 rounded-full bg-white/10 ipulse" style={{ animationDelay: '3s' }}></div>
              <div className="absolute bottom-20 left-1/4 w-20 h-20 rounded-full bg-white/10 ipulse" style={{ animationDelay: '5s' }}></div>
              <div className="absolute top-1/4 right-20 w-12 h-12 rounded-full bg-white/10 ipulse" style={{ animationDelay: '8s' }}></div>
          </div>
          <div className="m-auto sm:w-full md:w-3/4 max-w-4xl relative">
            {children}
            <div className="flex flex-col items-center py-5">
              <ScrapStats />
              {process.env.NODE_ENV === 'development' && (<ScrapButton />)}
            </div>
          </div>
        </Providers>
    </>
  );
}
