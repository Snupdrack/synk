'use client';

import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Cookie } from 'lucide-react';
import { motion } from 'framer-motion';

export function CookiesView() {
  const { setView } = useStore();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Button variant="ghost" onClick={() => setView('home')} className="mb-6 text-[#8888aa] hover:text-[#00f0ff]">
          <ArrowLeft className="w-4 h-4 mr-2" /> Inicio
        </Button>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-[rgba(0,240,255,0.1)] rounded-xl flex items-center justify-center">
            <Cookie className="w-6 h-6 text-[#00f0ff]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Política de Cookies</h1>
            <p className="text-[#8888aa] text-sm">Última actualización: {new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none space-y-6 text-[#8888aa] text-sm leading-relaxed">
          <section>
            <h2 className="text-white text-lg font-semibold mb-2">¿Qué son las cookies?</h2>
            <p>
              Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web.
              Nos permiten recordar tus preferencias, mantener tu sesión activa y mejorar tu experiencia de navegación en DOCUFAST.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-2">Tipos de cookies que utilizamos</h2>
            <div className="space-y-4">
              <div className="border border-[rgba(0,240,255,0.12)] rounded-lg p-4 bg-[#0f0f1a]">
                <h3 className="text-[#00f0ff] font-medium mb-1">Cookies Esenciales</h3>
                <p>Necesarias para el funcionamiento básico de la plataforma. Incluyen tu sesión de usuario y preferencias de seguridad. No pueden ser desactivadas.</p>
              </div>
              <div className="border border-[rgba(0,240,255,0.12)] rounded-lg p-4 bg-[#0f0f1a]">
                <h3 className="text-[#00f0ff] font-medium mb-1">Cookies de Preferencias</h3>
                <p>Almacenan tus preferencias de la plataforma, como el idioma y la apariencia, para ofrecerte una experiencia personalizada.</p>
              </div>
              <div className="border border-[rgba(0,240,255,0.12)] rounded-lg p-4 bg-[#0f0f1a]">
                <h3 className="text-[#00f0ff] font-medium mb-1">Cookies Analíticas</h3>
                <p>Nos ayudan a entender cómo los usuarios interactúan con la plataforma para mejorar nuestros servicios. La información recopilada es anónima.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-2">¿Cómo controlamos las cookies?</h2>
            <p>
              Al ingresar por primera vez a DOCUFAST, se te presenta un aviso de cookies donde puedes aceptar o rechazar el uso de cookies no esenciales.
              Puedes cambiar tus preferencias en cualquier momento eliminando las cookies de tu navegador.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-2">Cookies de terceros</h2>
            <p>
              DOCUFAST no comparte datos de cookies con terceros con fines publicitarios. Solo utilizamos servicios de terceros esenciales para el funcionamiento
              de la plataforma (como proveedores de base de datos y autenticación).
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-2">¿Cómo eliminar las cookies?</h2>
            <p>
              Puedes eliminar o bloquear las cookies desde la configuración de tu navegador. Sin embargo, esto puede afectar la funcionalidad
              de la plataforma, incluyendo tu capacidad de iniciar sesión.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-2">Contacto</h2>
            <p>
              Si tienes preguntas sobre nuestra política de cookies, puedes contactarnos en:{' '}
              <span className="text-[#00f0ff]">soporte@docufast.mx</span>
            </p>
          </section>
        </div>

        <div className="mt-8 flex gap-3">
          <Button onClick={() => setView('home')} className="bg-[#00f0ff] text-[#07070d] hover:bg-[#00d4e0] font-semibold">
            Volver al inicio
          </Button>
          <Button variant="outline" onClick={() => setView('privacy' as any)} className="border-[rgba(0,240,255,0.2)] text-[#00f0ff] hover:bg-[#00f0ff] hover:text-[#07070d]">
            Ver Aviso de Privacidad
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
