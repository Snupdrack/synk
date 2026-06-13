'use client';

import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ArrowLeft, Save, Send, Loader2, CheckCircle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function AdminSettings() {
  const { adminSettings, fetchAdminSettings, setView } = useStore();
  const { toast } = useToast();
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    fetchAdminSettings();
  }, [fetchAdminSettings]);

  useEffect(() => {
    setForm(adminSettings);
  }, [adminSettings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast({ title: 'Configuración guardada' });
        await fetchAdminSettings();
      } else {
        toast({ title: 'Error', description: 'Error al guardar', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Error de conexión', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleTestTelegram = async () => {
    setTesting(true);
    try {
      const res = await fetch('/api/admin/telegram/test', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        toast({ title: '¡Notificación enviada!', description: data.message });
      } else {
        toast({ title: 'Error', description: data.message, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Error de conexión', variant: 'destructive' });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" onClick={() => setView('admin')} className="text-[#8888aa] hover:text-[#00f0ff]"><ArrowLeft className="w-4 h-4 mr-2" />Admin</Button>
          <h1 className="text-2xl font-bold text-white">Configuración</h1>
        </div>

        {/* Site Settings */}
        <Card className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] shadow-sm mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-white">General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-200">Nombre del sitio</Label>
              <Input value={form.site_name || ''} onChange={e => setForm({...form, site_name: e.target.value})} className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-200">Descripción</Label>
              <Input value={form.site_description || ''} onChange={e => setForm({...form, site_description: e.target.value})} className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] text-white" />
            </div>
          </CardContent>
        </Card>

        {/* Bank Settings */}
        <Card className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] shadow-sm mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-white">Datos Bancarios</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-200">Banco</Label>
              <Input value={form.bank_name || ''} onChange={e => setForm({...form, bank_name: e.target.value})} className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-200">Número de cuenta</Label>
              <Input value={form.bank_account || ''} onChange={e => setForm({...form, bank_account: e.target.value})} className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-200">Titular de la cuenta</Label>
              <Input value={form.bank_holder || ''} onChange={e => setForm({...form, bank_holder: e.target.value})} className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] text-white" />
            </div>
          </CardContent>
        </Card>

        {/* Telegram Settings */}
        <Card className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] shadow-sm mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-white">Notificaciones Telegram</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-[rgba(0,240,255,0.05)] border-[rgba(0,240,255,0.15)]">
              <Info className="h-4 w-4 text-[#00f0ff]" />
              <AlertDescription className="text-[#00f0ff] text-sm">
                <strong>Configuración paso a paso:</strong><br />
                1. En Telegram busca <strong>@BotFather</strong> → envía <code>/newbot</code> → obtén el token<br />
                2. Agrega el bot a tu grupo o canal<br />
                3. Obtén el Chat ID desde: <code>api.telegram.org/bot{'{TOKEN}'}/getUpdates</code><br />
                4. Pega los datos aquí y guarda
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Label className="text-gray-200">Token del Bot</Label>
              <Input value={form.telegram_token || ''} onChange={e => setForm({...form, telegram_token: e.target.value})} placeholder="123456:ABC-DEF..." className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] text-white placeholder:text-[#8888aa]" />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-200">Chat ID</Label>
              <Input value={form.telegram_chat_id || ''} onChange={e => setForm({...form, telegram_chat_id: e.target.value})} placeholder="-1001234567890" className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] text-white placeholder:text-[#8888aa]" />
            </div>
            <Button variant="outline" onClick={handleTestTelegram} disabled={testing} className="w-full border-[rgba(0,240,255,0.12)] text-[#00f0ff] hover:bg-[#00f0ff] hover:text-[#07070d]">
              {testing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
              {testing ? 'Enviando...' : 'Probar Notificación'}
            </Button>
          </CardContent>
        </Card>

        <Button onClick={handleSave} className="w-full bg-[#00f0ff] text-[#07070d] hover:bg-[#00d4e0] font-semibold" disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {saving ? 'Guardando...' : 'Guardar Configuración'}
        </Button>
      </motion.div>
    </div>
  );
}
