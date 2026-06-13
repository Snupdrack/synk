'use client';

import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { LogIn, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function LoginView() {
  const { login, setView, fetchOrders, fetchTransactions } = useStore();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(email, password);
    if (success) {
      toast({ title: '¡Bienvenido!', description: 'Has iniciado sesión correctamente' });
      await Promise.all([fetchOrders(), fetchTransactions()]);
      setView('dashboard');
    } else {
      setError('Email o contraseña incorrectos');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] shadow-lg">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-[rgba(0,240,255,0.1)] rounded-xl flex items-center justify-center mx-auto mb-3">
              <LogIn className="w-6 h-6 text-[#00f0ff]" />
            </div>
            <CardTitle className="text-2xl text-white">Iniciar Sesión</CardTitle>
            <p className="text-[#8888aa] text-sm mt-1">Accede a tu cuenta para gestionar tus trámites</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200">Email</Label>
                <Input id="email" type="email" placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)} required className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] text-white placeholder:text-[#8888aa]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-200">Contraseña</Label>
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] text-white placeholder:text-[#8888aa]" />
              </div>
              <Button type="submit" className="w-full bg-[#00f0ff] text-[#07070d] hover:bg-[#00d4e0] font-semibold" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {loading ? 'Iniciando...' : 'Iniciar Sesión'}
              </Button>
            </form>
            <div className="text-center mt-4">
              <p className="text-sm text-[#8888aa]">
                ¿No tienes cuenta?{' '}
                <Button variant="link" className="p-0 h-auto text-[#00f0ff]" onClick={() => setView('register')}>
                  Regístrate aquí
                </Button>
              </p>
            </div>
            <div className="mt-4 p-3 bg-[#13131f] rounded-lg text-xs text-[#8888aa] border border-[rgba(0,240,255,0.12)]">
              <p className="font-semibold mb-1 text-gray-300">Cuentas de prueba:</p>
              <p>Admin: admin@tramfast.io / admin123</p>
              <p>Usuario: juan@ejemplo.com / user123</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
