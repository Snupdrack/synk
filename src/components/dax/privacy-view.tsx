'use client';

import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export function PrivacyView() {
  const { setView } = useStore();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Button variant="ghost" onClick={() => setView('home')} className="mb-6 text-[#8888aa] hover:text-[#00f0ff]">
          <ArrowLeft className="w-4 h-4 mr-2" /> Inicio
        </Button>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-[rgba(0,240,255,0.1)] rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-[#00f0ff]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Aviso de Privacidad</h1>
            <p className="text-[#8888aa] text-sm">Última actualización: {new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        <div className="space-y-6 text-[#8888aa] text-sm leading-relaxed">
          <section>
            <h2 className="text-white text-lg font-semibold mb-2">Responsable del tratamiento de datos</h2>
            <p>
              DOCUFAST Servicios Digitales es responsable del tratamiento de tus datos personales.
              Puedes contactarnos en <span className="text-[#00f0ff]">soporte@docufast.mx</span>.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-2">Datos personales que recopilamos</h2>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Nombre completo</li>
              <li>Correo electrónico</li>
              <li>Número de teléfono (opcional)</li>
              <li>Información proporcionada en formularios de servicio (CURP, RFC, etc.)</li>
              <li>Datos de transacciones y pagos</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-2">Finalidades del tratamiento</h2>
            <p>Utilizamos tus datos para:</p>
            <ul className="list-disc list-inside space-y-1 pl-2 mt-2">
              <li>Gestionar tu cuenta y sesión en la plataforma</li>
              <li>Procesar y entregar los servicios solicitados</li>
              <li>Enviarte notificaciones sobre el estado de tus trámites</li>
              <li>Cumplir con obligaciones legales aplicables</li>
              <li>Mejorar nuestros servicios y experiencia de usuario</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-2">Transferencia de datos</h2>
            <p>
              No compartimos tus datos personales con terceros, salvo cuando sea estrictamente necesario para
              la prestación del servicio contratado (por ejemplo, consultas a registros gubernamentales como RENAPO, SAT o IMSS)
              o cuando lo exija la ley.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-2">Tus derechos ARCO</h2>
            <p>
              Tienes derecho a Acceder, Rectificar, Cancelar u Oponerte al tratamiento de tus datos personales.
              Para ejercer estos derechos, envíanos un correo a <span className="text-[#00f0ff]">soporte@docufast.mx</span> con
              el asunto "Derechos ARCO".
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-2">Seguridad de los datos</h2>
            <p>
              Implementamos medidas de seguridad técnicas y organizativas para proteger tus datos personales contra
              acceso no autorizado, pérdida o alteración. Tus contraseñas son almacenadas de forma encriptada y
              nunca en texto plano.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-2">Cambios a este aviso</h2>
            <p>
              Podemos actualizar este aviso de privacidad en cualquier momento. Te notificaremos sobre cambios
              significativos a través de la plataforma. El uso continuado del servicio implica la aceptación del aviso actualizado.
            </p>
          </section>
        </div>

        <div className="mt-8 flex gap-3">
          <Button onClick={() => setView('home')} className="bg-[#00f0ff] text-[#07070d] hover:bg-[#00d4e0] font-semibold">
            Volver al inicio
          </Button>
          <Button variant="outline" onClick={() => setView('cookies' as any)} className="border-[rgba(0,240,255,0.2)] text-[#00f0ff] hover:bg-[#00f0ff] hover:text-[#07070d]">
            Ver Política de Cookies
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
