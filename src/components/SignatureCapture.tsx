
import React, { useRef, useState } from 'react';
import SignaturePad from 'react-signature-canvas';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SignatureCaptureProps {
  onChange: (data: string | null) => void;
  value: string | null;
}

const SignatureCapture: React.FC<SignatureCaptureProps> = ({ onChange, value }) => {
  const signatureRef = useRef<SignaturePad>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const isMobile = useIsMobile();

  const handleClear = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
      setIsEmpty(true);
      onChange(null);
    }
  };

  const handleEnd = () => {
    if (signatureRef.current) {
      const pad = signatureRef.current;
      setIsEmpty(pad.isEmpty());
      
      if (!pad.isEmpty()) {
        const dataUrl = pad.toDataURL('image/png');
        onChange(dataUrl);
      }
    }
  };

  return (
    <div className="space-y-2">
      {value ? (
        <div className="border rounded-md overflow-hidden bg-white p-2">
          <img src={value} alt="Assinatura" className="w-full h-auto" />
          <div className="mt-2 flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onChange(null)}
            >
              Refazer assinatura
            </Button>
          </div>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden bg-white">
          <SignaturePad
            ref={signatureRef}
            canvasProps={{
              className: 'w-full h-40',
              width: isMobile ? 300 : 500,
              height: 160,
            }}
            onEnd={handleEnd}
          />
          <div className="bg-gray-50 p-2 flex justify-between items-center border-t">
            <p className="text-xs text-muted-foreground">
              {isEmpty ? 'Assine no campo acima' : 'Assinatura capturada'}
            </p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClear} 
              disabled={isEmpty}
            >
              <RefreshCw className="h-4 w-4 mr-1" /> Limpar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignatureCapture;
