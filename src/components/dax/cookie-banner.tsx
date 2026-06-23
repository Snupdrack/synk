'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Cookie, X, ShieldCheck } from 'lucide-react';

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
    <div className="fixed inset-0 z-[9999] flex items-end justify-center pointer-events-none">
      {/* Overlay sutil */}
      <div className="absolute inset-0 bg-black/40 pointer-events-auto" onClick={reject} />

      {/* Banner */}
      <div className="relative pointer-events-auto w-full max-w-2xl mx-4 mb-6 rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(0,240,255,0.15)]">
        {/* Borde glow superior */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent" />

        <div className="bg-[#0f0f1a] border border-[rgba(0,240,255,0.2)] rounded-2xl p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[rgba(0,240,255,0.1)] rounded-xl flex items-center justify-center flex-shrink-0 shadow-[0_0_16px_rgba(0,240,255,0.2)]">
                <Cookie className="w-6 h-6 text-[#00f0ff]" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg leading-tight">Usamos cookies</h3>
                <p className="text-[#8888aa] text-xs mt-0.5">DOCUFAST Servicios Digitales</p>
              </div>
            </div>
            <button onClick={reject} className="text-[#8888aa] hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Texto */}
          <p className="text-[#aaaacc] text-sm leading-relaxed mb-5">
            Utilizamos cookies <strong className="text-white">esenciales</strong> para el funcionamiento de la plataforma
            y cookies <strong className="text-white">analíticas</strong> para mejorar tu experiencia de navegación.
            Puedes aceptar todas las cookies o solo las esenciales.
          </p>

          {/* Badges de tipos */}
          <div className="flex flex-wrap gap-2 mb-5">
            {['Sesión de usuario', 'Preferencias', 'Análisis de uso'].map(tag => (
              <span key={tag} className="text-xs px-3 py-1 rounded-full bg-[rgba(0,240,255,0.06)] border border-[rgba(0,240,255,0.15)] text-[#00f0ff]">
                {tag}
              </span>
            ))}
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={accept}
              className="flex-1 bg-[#00f0ff] text-[#07070d] hover:bg-[#00d4e0] font-bold text-sm h-11 shadow-[0_0_20px_rgba(0,240,255,0.3)]"
            >
              <ShieldCheck className="w-4 h-4 mr-2" />
              Aceptar todas
            </Button>
            <Button
              variant="outline"
              onClick={reject}
              className="flex-1 border-[rgba(0,240,255,0.25)] text-[#8888aa] hover:text-white hover:border-[rgba(0,240,255,0.5)] hover:bg-white/5 text-sm h-11"
            >
              Solo esenciales
            </Button>
          </div>

          {/* Link política */}
          <p className="text-center text-xs text-[#666688] mt-4">
            Al aceptar, confirmas haber leído nuestra{' '}
            <button
              onClick={() => { reject(); }}
              className="text-[#00f0ff] hover:underline"
            >
              Política de Cookies
            </button>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
