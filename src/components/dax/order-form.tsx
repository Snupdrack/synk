'use client';

import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { ArrowLeft, Clock, FileText, CreditCard, Building, Heart, Shield, Plane, Receipt, FileCheck, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const iconMap: Record<string, any> = {
  FileText, CreditCard, Building, Heart, Shield, Plane, Receipt, FileCheck,
};

export function OrderFormView() {
  const { services, selectedServiceId, user, setView, fetchOrders, fetchTransactions, fetchUser } = useStore();
  const { toast } = useToast();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const service = services.find(s => s.id === selectedServiceId);

  if (!service) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-[#8888aa]">Servicio no encontrado</p>
        <Button variant="outline" onClick={() => setView('services')} className="mt-4 border-[rgba(0,240,255,0.12)] text-[#00f0ff] hover:bg-[#00f0ff] hover:text-[#07070d]">Ver Servicios</Button>
      </div>
    );
  }

  let fields = [];
  try {
    const rawFields = typeof service.fields === 'string' ? JSON.parse(service.fields || '[]') : service.fields;
    fields = Array.isArray(rawFields) ? rawFields : [];
  } catch (e) {
    console.error('Error parsing service fields:', e);
  }
  const hasBalance = user && user.balance >= service.price;
  const IconComp = iconMap[service.icon] || FileText;

  const handleSubmit = async () => {
    // Validate required fields
    for (const field of fields) {
      if (field.required && !formData[field.key]?.trim()) {
        toast({ title: 'Campo requerido', description: `Por favor completa: ${field.label}`, variant: 'destructive' });
        return;
      }
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceId: service.id, formData, notes }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast({ title: 'Error', description: data.error || 'Error al crear pedido', variant: 'destructive' });
        return;
      }

      setSuccess(true);
      toast({ title: '¡Pedido creado!', description: 'Tu solicitud ha sido registrada exitosamente' });
      await Promise.all([fetchOrders(), fetchTransactions(), fetchUser()]);
    } catch {
      toast({ title: 'Error', description: 'Error de conexión', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="w-20 h-20 bg-[rgba(0,240,255,0.1)] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-[#00f0ff]" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">¡Pedido Creado Exitosamente!</h2>
          <p className="text-[#8888aa] mb-6">Tu solicitud de {service.name} ha sido registrada. Te notificaremos cuando haya actualizaciones.</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => setView('dashboard-orders')} className="bg-[#00f0ff] text-[#07070d] hover:bg-[#00d4e0]">Ver Mis Pedidos</Button>
            <Button variant="outline" onClick={() => setView('services')} className="border-[rgba(0,240,255,0.12)] text-[#00f0ff] hover:bg-[#00f0ff] hover:text-[#07070d]">Seguir Navegando</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Button variant="ghost" onClick={() => setView('services')} className="mb-4 text-[#8888aa] hover:text-[#00f0ff]">
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver a servicios
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[rgba(0,240,255,0.1)] rounded-lg flex items-center justify-center">
                    <IconComp className="w-5 h-5 text-[#00f0ff]" />
                  </div>
                  <div>
                    <CardTitle className="text-white">{service.name}</CardTitle>
                    <p className="text-sm text-[#8888aa] mt-1">{service.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.map((field: any) => (
                  <div key={field.key} className="space-y-2">
                    <Label htmlFor={field.key} className="text-gray-200">
                      {field.label} {field.required && <span className="text-red-400">*</span>}
                    </Label>
                    {field.type === 'select' ? (
                      <Select value={formData[field.key] || ''} onValueChange={v => setFormData({ ...formData, [field.key]: v })}>
                        <SelectTrigger className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] text-white"><SelectValue placeholder={field.placeholder || 'Seleccionar'} /></SelectTrigger>
                        <SelectContent>
                          {(field.options || []).map((opt: string) => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id={field.key}
                        type={field.type === 'date' ? 'date' : field.type === 'password' ? 'password' : field.type === 'email' ? 'email' : 'text'}
                        placeholder={field.placeholder || ''}
                        value={formData[field.key] || ''}
                        onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                        className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] text-white placeholder:text-[#8888aa]"
                      />
                    )}
                  </div>
                ))}
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-gray-200">Notas adicionales</Label>
                  <Textarea id="notes" placeholder="Información adicional que consideres relevante..." value={notes} onChange={e => setNotes(e.target.value)} className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] text-white placeholder:text-[#8888aa]" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <Card className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] shadow-sm">
              <CardContent className="pt-6 space-y-4">
                <h3 className="font-semibold text-white">Resumen del Pedido</h3>
                <Separator className="bg-[rgba(0,240,255,0.12)]" />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8888aa]">Servicio</span>
                    <span className="font-medium text-white">{service.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8888aa]">Tiempo estimado</span>
                    <span className="flex items-center gap-1 text-gray-200"><Clock className="w-3 h-3" />{service.deliveryTime}</span>
                  </div>
                  <Separator className="bg-[rgba(0,240,255,0.12)]" />
                  <div className="flex justify-between">
                    <span className="font-semibold text-white">Total</span>
                    <span className="text-xl font-bold text-[#00f0ff]">${service.price} MXN</span>
                  </div>
                </div>

                {user && (
                  <>
                    <Separator className="bg-[rgba(0,240,255,0.12)]" />
                    <div className="flex justify-between text-sm">
                      <span className="text-[#8888aa]">Tu saldo</span>
                      <span className={hasBalance ? 'text-[#00f0ff] font-medium' : 'text-red-400 font-medium'}>${user.balance.toFixed(2)} MXN</span>
                    </div>
                    {hasBalance && (
                      <div className="flex justify-between text-sm">
                        <span className="text-[#8888aa]">Saldo después</span>
                        <span className="text-gray-200">${(user.balance - service.price).toFixed(2)} MXN</span>
                      </div>
                    )}
                  </>
                )}

                {!hasBalance && user && (
                  <Alert className="border-[rgba(255,200,0,0.3)] bg-[rgba(255,200,0,0.05)]">
                    <AlertCircle className="h-4 w-4 text-[#ffc800]" />
                    <AlertDescription className="text-[#ffc800] text-sm">
                      Saldo insuficiente. Necesitas recargar ${(service.price - user.balance).toFixed(2)} MXN más.
                      <Button variant="link" className="p-0 h-auto text-[#ffc800] ml-1" onClick={() => setView('dashboard-wallet')}>
                        Recargar ahora
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}

                <Button className="w-full bg-[#00f0ff] text-[#07070d] hover:bg-[#00d4e0] font-semibold" disabled={submitting || !hasBalance} onClick={handleSubmit}>
                  {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  {submitting ? 'Procesando...' : 'Solicitar Servicio'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
