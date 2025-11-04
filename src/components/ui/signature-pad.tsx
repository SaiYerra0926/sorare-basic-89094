import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eraser, Pen, Type } from 'lucide-react';

interface SignaturePadProps {
  value?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ value, onChange, onBlur }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureMode, setSignatureMode] = useState<'draw' | 'text'>('draw');
  const [textValue, setTextValue] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size with proper pixel ratio for high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = 200 * dpr;

    // Scale context for high DPI
    ctx.scale(dpr, dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = '200px';

    // Set drawing style
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // If there's a value and it's a base64 image, draw it
    if (value && value.startsWith('data:image')) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
        ctx.drawImage(img, 0, 0, rect.width, 200);
      };
      img.src = value;
    } else if (value && signatureMode === 'text') {
      setTextValue(value);
    }
  }, [value, signatureMode]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (signatureMode !== 'draw') return;
    
    e.preventDefault();
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || signatureMode !== 'draw') return;

    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    saveSignature();
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Convert canvas to base64 image
    const dataURL = canvas.toDataURL('image/png');
    onChange(dataURL);
    if (onBlur) onBlur();
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onChange('');
    if (onBlur) onBlur();
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setTextValue(text);
    onChange(text);
  };

  return (
    <div className="space-y-3">
      {/* Mode Toggle */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant={signatureMode === 'draw' ? 'default' : 'outline'}
          size="sm"
          onClick={() => {
            setSignatureMode('draw');
            if (textValue) {
              setTextValue('');
              onChange('');
            }
          }}
          className="flex items-center gap-2"
        >
          <Pen className="w-4 h-4" />
          Draw Signature
        </Button>
        <Button
          type="button"
          variant={signatureMode === 'text' ? 'default' : 'outline'}
          size="sm"
          onClick={() => {
            setSignatureMode('text');
            const canvas = canvasRef.current;
            if (canvas) {
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
              }
            }
            onChange('');
          }}
          className="flex items-center gap-2"
        >
          <Type className="w-4 h-4" />
          Type Signature
        </Button>
      </div>

      {/* Drawing Canvas */}
      {signatureMode === 'draw' && (
        <div className="space-y-2">
          <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
            <canvas
              ref={canvasRef}
              className="w-full cursor-crosshair"
              style={{ height: '200px', touchAction: 'none' }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearSignature}
              className="flex items-center gap-2"
            >
              <Eraser className="w-4 h-4" />
              Clear
            </Button>
            <p className="text-xs text-gray-500 flex items-center">
              Draw your signature above or switch to type mode
            </p>
          </div>
          {value && value.startsWith('data:image') && (
            <div className="mt-2">
              <p className="text-xs text-green-600">Signature captured</p>
            </div>
          )}
        </div>
      )}

      {/* Text Input */}
      {signatureMode === 'text' && (
        <div className="space-y-2">
          <Input
            type="text"
            value={textValue}
            onChange={handleTextChange}
            onBlur={onBlur}
            placeholder="Type your signature"
            className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
          />
          <p className="text-xs text-gray-500">
            Type your full name as your signature
          </p>
        </div>
      )}
    </div>
  );
};

