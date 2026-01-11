export default function HeaderPanel({
  children,
}: Readonly<{
  children?: React.ReactNode | undefined;
}>) {
  return (
    <div className="min-h-[36px] md:min-h-[52px]">
      {children}
    </div> 
  );
}