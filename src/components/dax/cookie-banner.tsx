'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Cookie, X } from 'lucide-react';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('docufast-cookie-consent');
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem('docufast-cookie-consent', 'accepted');
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem('docufast-cookie-consent', 'rejected');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6">
      <div className="max-w-4xl mx-auto bg-[#0f0f1a] border border-[rgba(0,240,255,0.2)] rounded-xl shadow-[0_0_40px_rgba(0,240,255,0.08)] p-4 sm:p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-[rgba(0,240,255,0.1)] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <Cookie className="w-5 h-5 text-[#00f0ff]" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold text-sm mb-1">Usamos cookies</h3>
            <p className="text-[#8888aa] text-xs leading-relaxed">
              Utilizamos cookies esenciales para el funcionamiento de la plataforma y cookies analíticas para mejorar tu experiencia. 
              Al continuar navegando, aceptas nuestra{' '}
              <span className="text-[#00f0ff]">Política de Cookies</span>.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            <Button
              size="sm"
              variant="outline"
              onClick={reject}
              className="text-xs border-[rgba(0,240,255,0.2)] text-[#8888aa] hover:text-white hover:border-[rgba(0,240,255,0.4)] h-8"
            >
              Rechazar
            </Button>
            <Button
              size="sm"
              onClick={accept}
              className="text-xs bg-[#00f0ff] text-[#07070d] hover:bg-[#00d4e0] font-semibold h-8"
            >
              Aceptar
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={reject}
              className="text-[#8888aa] hover:text-white p-1 h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
