import { Html, Head, Main, NextScript } from 'next/document';
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </Head>
      <body
        className={`antialiased overflow-x-hidden bg-animated-gradient
          flex flex-col items-center
        `}
      >
        <div className="w-full mins-w-screen grow p-3 md:p-15 relative z-10">
          <Main />
        </div>        
        <NextScript />
      </body>
    </Html>
  );
}