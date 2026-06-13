'use client';

import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Shield, Zap, Headphones, FileText, CreditCard, Building, Heart, CheckCircle } from 'lucide-react';

const iconMap: Record<string, any> = {
  FileText, CreditCard, Building, Heart, Shield, Plane: FileText, Receipt: FileText, FileCheck: FileText,
};

const features = [
  { icon: Zap, title: 'Rápido', desc: 'Trámites en tiempo récord' },
  { icon: Shield, title: 'Seguro', desc: 'Tus datos protegidos' },
  { icon: Headphones, title: 'Soporte', desc: 'Atención personalizada' },
  { icon: CheckCircle, title: 'Confiable', desc: 'Más de 1000 trámites realizados' },
];

export function HomeView() {
  const { services, setView, setSelectedService, user } = useStore();

  const featuredServices = services.slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#00f0ff]/20 via-[#9d00ff]/20 to-[#07070d] text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-[#00f0ff] rounded-full blur-[128px] opacity-10" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#9d00ff] rounded-full blur-[128px] opacity-10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ff00ff] rounded-full blur-[200px] opacity-5" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Trámites Digitales<br />
              <span className="bg-gradient-to-r from-[#00f0ff] to-[#9d00ff] bg-clip-text text-transparent">sin complicaciones</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-[#8888aa] max-w-2xl">
              Código a Medida. Inteligencia en cada Dato. Gestiona tus trámites gubernamentales de forma rápida y segura.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg" onClick={() => setView('services')} className="bg-[#00f0ff] text-[#07070d] hover:bg-[#00d4e0] font-semibold">
                Ver Servicios <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              {!user && (
                <Button size="lg" variant="outline" onClick={() => setView('register')} className="border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff] hover:text-[#07070d]">
                  Crear Cuenta
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-[#07070d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="text-center hover:shadow-lg transition-shadow bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] shadow-sm">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-[rgba(0,240,255,0.1)] rounded-xl flex items-center justify-center mx-auto mb-3">
                      <f.icon className="w-6 h-6 text-[#00f0ff]" />
                    </div>
                    <h3 className="font-semibold text-white">{f.title}</h3>
                    <p className="text-sm text-[#8888aa] mt-1">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16 bg-[#0f0f1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white">Servicios Populares</h2>
            <p className="text-[#8888aa] mt-2">Los trámites más solicitados por nuestros usuarios</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredServices.map((service, i) => {
              const IconComp = iconMap[service.icon] || FileText;
              return (
                <motion.div key={service.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer bg-[#13131f] border-[rgba(0,240,255,0.12)] shadow-sm h-full"
                    onClick={() => { if (!user) { setView('login'); return; } setSelectedService(service.id); setView('order'); }}>
                    <CardContent className="pt-6 flex flex-col h-full">
                      <div className="w-12 h-12 bg-[rgba(0,240,255,0.1)] rounded-xl flex items-center justify-center mb-4">
                        <IconComp className="w-6 h-6 text-[#00f0ff]" />
                      </div>
                      <h3 className="font-semibold text-white mb-1">{service.name}</h3>
                      <p className="text-sm text-[#8888aa] mb-4 flex-1 line-clamp-2">{service.description}</p>
                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-[rgba(0,240,255,0.12)]">
                        <span className="text-lg font-bold text-[#00f0ff]">${service.price}</span>
                        <span className="text-xs text-[#8888aa] flex items-center gap-1"><Clock className="w-3 h-3" />{service.deliveryTime}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" onClick={() => setView('services')} className="border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff] hover:text-[#07070d]">
              Ver todos los servicios <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#07070d]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">¿Listo para iniciar tu trámite?</h2>
          <p className="text-[#8888aa] mb-8">Regístrate hoy y gestiona todos tus trámites desde un solo lugar.</p>
          <Button size="lg" onClick={() => setView(user ? 'services' : 'register')} className="bg-[#00f0ff] text-[#07070d] hover:bg-[#00d4e0] font-semibold">
            {user ? 'Solicitar Servicio' : 'Comenzar Ahora'} <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
}
