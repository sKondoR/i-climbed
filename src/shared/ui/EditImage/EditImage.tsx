import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontSizeControl } from '../FontSizeControl';

type EditImageProps = {
    imgSrc: string,
    name: string,
    region?: string,
    grade: string,
};

const EditImage = ({
    imgSrc = '', // ожидается в формате data:image/png;base64,...
    name = '',
    region = '',
    grade = '',
}: EditImageProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(30);
  const [fontSizeRegion, setFontSizeRegion] = useState(20);
  const [p, setTextPosition] = useState({
    isTop: false,
    isRight: false,
  });

  useEffect(() => {
    if (!imgSrc || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();

    img.onload = () => {
      // Устанавливаем размеры canvas под изображение
      canvas.width = img.width;
      canvas.height = img.height;

      // Очищаем и рисуем фон
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      // Настройки стиля текста
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.fillStyle = textColor;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.lineWidth = 7;
      ctx.lineJoin = 'round';

      // Параметры позиционирования
      const lineHeight = fontSize + 10;
      const regionLineHeight = fontSizeRegion + 10;  
      const startY = p.isTop ? ((text ? 2 : 1) * lineHeight + regionLineHeight) : (canvas.height - regionLineHeight) + 10;
      const startX = p.isRight ? canvas.width - 30 : 30;
      ctx.textAlign = p.isRight ? 'right' : 'left';

      // Формируем строки
      const routeText = `${grade} ${name}`;

      // Отрисовка текста с эффектом обводки
      const renderText = (txt: string, y: number, txtSize: number) => {
        ctx.font = `bold ${txtSize}px Arial`;
        if (!txt.trim()) return;
        ctx.strokeText(txt, startX, y);
        ctx.fillText(txt, startX, y);
      };

      renderText(text, startY - lineHeight - regionLineHeight, fontSize);
      renderText(routeText, startY - regionLineHeight, fontSize);
      renderText(region, startY, fontSizeRegion);
    };

    img.src = imgSrc; // Уже base64 — можно использовать напрямую
  }, [imgSrc, text, name, region, grade, p.isRight, p.isTop, textColor, fontSize, fontSizeRegion]);

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'my-route.jpg';
    link.href = canvas.toDataURL('image/jpeg', 1); // JPEG с качеством 100%
    link.click();
  };

  const onTextPositionClick = (top: boolean, right: boolean) => () => {
    setTextPosition({ isTop: top, isRight: right });
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.preventDefault();
  };

  return (
    <>
    <div className="flex flex-wrap justify-center mb-3 mt-1 items-center" >
        <div className="mr-5" >
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Введите текст"
                className="px-3 py-1 w-[200px] rounded-md border-2 border-cyan-700 focus:border-pink-700 focus:outline-none" 
            />
        </div>
        <div className="flex flex-wrap rounded-md w-8 h-8 border-2 border-cyan-700 overflow-hidden transition-shadow mr-5">
          <div className={`w-1/2 h-1/2 ${p.isTop && !p.isRight ? 'bg-pink-700' : 'cursor-pointer hover:bg-cyan-700'}`}
            role="button"
            onClick={onTextPositionClick(true, false)}
            onKeyDown={handleKeyDown}
          ></div>
          <div className={`w-1/2 h-1/2 ${p.isTop && p.isRight ? 'bg-pink-700' : 'cursor-pointer hover:bg-cyan-700'}`}
            role="button"
            onClick={onTextPositionClick(true, true)}
            onKeyDown={handleKeyDown}
          ></div>
          <div className={`w-1/2 h-1/2 ${!p.isTop && !p.isRight ? 'bg-pink-700' : 'cursor-pointer hover:bg-cyan-700'}`}
            role="button"
            onClick={onTextPositionClick(false, false)}
            onKeyDown={handleKeyDown}
          ></div>
          <div className={`w-1/2 h-1/2 ${!p.isTop && p.isRight ? 'bg-pink-700' : 'cursor-pointer hover:bg-cyan-700'}`}
            role="button"
            onClick={onTextPositionClick(false, true)}
            onKeyDown={handleKeyDown}
          ></div>
        </div>
        <div className="mr-5">
            <FontSizeControl
                value={fontSize}
                defaultValue={30}
                onChange={(val: number) => setFontSize(val)}
            />
        </div>
        <div className="mr-5">
            <FontSizeControl
                value={fontSizeRegion}
                defaultValue={20}
                onChange={(val: number) => setFontSizeRegion(val)}
            />
        </div>
        <div className="mr-5">
          <input
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
            className="w-8 h-8 cursor-pointer rounded-md border-2 border-cyan-700 focus:border-pink-700 focus:outline-none"
            title="Выберите цвет текста"
          />
        </div>
        <FontAwesomeIcon
            icon={faDownload}
            className="text-2xl cursor-pointer text-cyan-700 hover:text-pink-700 mt-1 h-5 w-5" 
            onClick={downloadImage}
            aria-label={`скачать изображение`}
        />
      </div>
      <div className="flex justify-center overflow-auto">
        <canvas
            ref={canvasRef}
            style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
        />
      </div>
    </>
  );
};

export default EditImage;
