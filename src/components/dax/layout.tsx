'use client';

import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, LogOut, User, LayoutDashboard, Shield, MessageCircle } from 'lucide-react';
import { useState } from 'react';

export function DaxLayout({ children }: { children: React.ReactNode }) {
  const { user, setView, logout } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: 'Inicio', view: 'home' as const },
    { label: 'Servicios', view: 'services' as const },
  ];

  const handleNav = (view: any) => {
    setView(view);
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07070d]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#07070d]/95 backdrop-blur-xl border-b border-[rgba(0,240,255,0.12)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button onClick={() => handleNav('home')} className="flex items-center gap-2">
            <img src="/logo.svg" alt="DOCUFAST" className="h-8 w-auto drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]" />
            <span className="text-xl font-bold bg-gradient-to-r from-[#00f0ff] to-[#9d00ff] bg-clip-text text-transparent">DOCUFAST</span>
            <span className="hidden sm:inline text-xs text-[#8888aa] border-l border-[rgba(0,240,255,0.12)] pl-2 ml-1">Servicios Digitales</span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <Button key={item.view} variant="ghost" onClick={() => handleNav(item.view)} className="text-[#8888aa] hover:text-[#00f0ff]">
                {item.label}
              </Button>
            ))}
            {user ? (
              <>
                <Button variant="ghost" onClick={() => handleNav('dashboard')} className="text-[#8888aa] hover:text-[#00f0ff]">
                  <LayoutDashboard className="w-4 h-4 mr-1" />
                  Mi Panel
                </Button>
                {user.role === 'admin' && (
                  <Button variant="ghost" onClick={() => handleNav('admin')} className="text-[#8888aa] hover:text-[#00f0ff]">
                    <Shield className="w-4 h-4 mr-1" />
                    Admin
                  </Button>
                )}
                <div className="flex items-center gap-2 ml-2 pl-2 border-l border-[rgba(0,240,255,0.12)]">
                  <div className="w-8 h-8 bg-[rgba(0,240,255,0.1)] rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-[#00f0ff]" />
                  </div>
                  <span className="text-sm font-medium text-gray-200">{user.name}</span>
                  <Button variant="ghost" size="sm" onClick={logout} className="text-[#8888aa] hover:text-red-400">
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 ml-2 pl-2 border-l border-[rgba(0,240,255,0.12)]">
                <Button variant="outline" onClick={() => handleNav('login')} className="border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff] hover:text-[#07070d]">Iniciar Sesión</Button>
                <Button onClick={() => handleNav('register')} className="bg-[#00f0ff] text-[#07070d] hover:bg-[#00d4e0] font-semibold">Registrarse</Button>
              </div>
            )}
          </nav>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-[#8888aa]"><Menu className="w-5 h-5" /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-[#0f0f1a] border-l border-[rgba(0,240,255,0.12)]">
              <div className="flex flex-col gap-4 mt-8">
                {navItems.map(item => (
                  <Button key={item.view} variant="ghost" onClick={() => handleNav(item.view)} className="justify-start text-lg text-[#8888aa] hover:text-[#00f0ff]">
                    {item.label}
                  </Button>
                ))}
                <hr className="border-[rgba(0,240,255,0.12)]" />
                {user ? (
                  <>
                    <Button variant="ghost" onClick={() => handleNav('dashboard')} className="justify-start text-[#8888aa] hover:text-[#00f0ff]">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Mi Panel
                    </Button>
                    {user.role === 'admin' && (
                      <Button variant="ghost" onClick={() => handleNav('admin')} className="justify-start text-[#8888aa] hover:text-[#00f0ff]">
                        <Shield className="w-4 h-4 mr-2" />
                        Admin
                      </Button>
                    )}
                    <Button variant="ghost" onClick={() => { logout(); setMobileOpen(false); }} className="justify-start text-red-400">
                      <LogOut className="w-4 h-4 mr-2" /> Cerrar Sesión
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => handleNav('login')} className="border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff] hover:text-[#07070d]">Iniciar Sesión</Button>
                    <Button onClick={() => handleNav('register')} className="bg-[#00f0ff] text-[#07070d] hover:bg-[#00d4e0] font-semibold">Registrarse</Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-[#07070d] text-[#8888aa] py-8 mt-auto border-t border-[rgba(0,240,255,0.12)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <img src="/logo.svg" alt="DOCUFAST" className="h-8 w-auto drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]" />
                <span className="text-lg font-bold bg-gradient-to-r from-[#00f0ff] to-[#9d00ff] bg-clip-text text-transparent">DOCUFAST</span>
              </div>
              <p className="text-sm">Código a Medida. Inteligencia en cada Dato.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Servicios</h4>
              <ul className="space-y-1 text-sm">
                <li>Actas</li>
                <li>Identificación</li>
                <li>Fiscal</li>
                <li>Legal</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Contacto</h4>
              <ul className="space-y-1 text-sm">
                <li>soporte@synkdata.online</li>
                <li className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  WhatsApp: 8146954100
                </li>
                <li>Lunes a Viernes: 9:00 - 18:00</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[rgba(0,240,255,0.12)] mt-6 pt-4 text-center text-sm space-y-2">
            <div className="flex items-center justify-center gap-4">
              <button onClick={() => handleNav('cookies' as any)} className="text-[#8888aa] hover:text-[#00f0ff] transition-colors">Política de Cookies</button>
              <span className="text-[rgba(0,240,255,0.2)]">|</span>
              <button onClick={() => handleNav('privacy' as any)} className="text-[#8888aa] hover:text-[#00f0ff] transition-colors">Aviso de Privacidad</button>
            </div>
            <div>© {new Date().getFullYear()} DOCUFAST Servicios Digitales. Todos los derechos reservados.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
