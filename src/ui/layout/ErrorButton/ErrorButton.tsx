import { useState } from "react";

export default function ErrorButton({
  onClick,
  title = 'сообщить об ошибке',
}: Readonly<{
  onClick: () => Promise<void>;
  title: string;
}>) {
  const [isDisabled, setIsDisabled] = useState(false); 
  if (onClick === undefined) {
    return null;
  }
  const handleOnClick = () => {
    setIsDisabled(true);
    onClick();
    setTimeout(() => {
      setIsDisabled(false);
    }, 3000);
  };
  return (
    <button
      type="button"
      className={`rounded-md px-7 py-2 font-bold bg-cyan-800 text-white hover:text-white transition-colors
        hover:bg-pink-800 focus:outline-none cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
      onClick={handleOnClick}
      disabled={isDisabled}
    >
      {title}
    </button>
  );
}