'use client';

import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ArrowLeft, Wallet, Plus, TrendingDown, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle, Loader2, CreditCard, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const typeConfig: Record<string, { label: string; color: string; icon: any }> = {
  deposit: { label: 'Recarga', color: 'text-[#00f0ff]', icon: TrendingUp },
  payment: { label: 'Pago', color: 'text-red-400', icon: TrendingDown },
  refund: { label: 'Reembolso', color: 'text-[#00f0ff]', icon: TrendingUp },
};

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pendiente', color: 'bg-[rgba(255,200,0,0.1)] text-[#ffc800]' },
  approved: { label: 'Aprobado', color: 'bg-[rgba(57,255,20,0.1)] text-[#39ff14]' },
  rejected: { label: 'Rechazado', color: 'bg-[rgba(255,50,50,0.1)] text-[#ff3232]' },
};

export function DashboardWallet() {
  const { user, transactions, fetchTransactions, fetchUser, setView, adminSettings } = useStore();
  const { toast } = useToast();
  const [depositOpen, setDepositOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [depositNotes, setDepositNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  if (!user) return null;

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({ title: 'Error', description: 'Ingresa un monto válido', variant: 'destructive' });
      return;
    }
    if (!reference.trim()) {
      toast({ title: 'Error', description: 'Ingresa la referencia de tu depósito', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(amount), reference, notes: depositNotes }),
      });
      if (res.ok) {
        toast({ title: '¡Solicitud enviada!', description: 'Tu recarga será procesada pronto' });
        setDepositOpen(false);
        setAmount('');
        setReference('');
        setDepositNotes('');
        await fetchTransactions();
      } else {
        const data = await res.json();
        toast({ title: 'Error', description: data.error, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Error de conexión', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Button variant="ghost" onClick={() => setView('dashboard')} className="mb-4 text-[#8888aa] hover:text-[#00f0ff]">
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver al panel
        </Button>

        {/* Balance Card */}
        <Card className="bg-gradient-to-r from-[#00f0ff] to-[#9d00ff] text-white mb-6 border-0 shadow-sm">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Tu Saldo</p>
                <p className="text-3xl font-bold">${user.balance.toFixed(2)} MXN</p>
              </div>
              <Dialog open={depositOpen} onOpenChange={setDepositOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/20">
                    <Plus className="w-4 h-4 mr-2" /> Recargar
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)]">
                  <DialogHeader>
                    <DialogTitle className="text-white">Solicitar Recarga</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <Alert className="bg-[rgba(0,240,255,0.05)] border-[rgba(0,240,255,0.15)]">
                      <Info className="h-4 w-4 text-[#00f0ff]" />
                      <AlertDescription className="text-[#00f0ff] text-sm">
                        <strong>Datos bancarios:</strong><br />
                        Banco: SANTANDER<br />
                        CLABE: 0146 1014 0229 4278 94<br />
                        Titular: EVANGELINA GARCIA<br />
                        Concepto: PANELTRAMITES<br />
                        Mínimo: $250 MXN
                      </AlertDescription>
                    </Alert>
                    <div className="space-y-2">
                      <Label className="text-gray-200">Monto a recargar (MXN)</Label>
                      <Input type="number" min="1" placeholder="500" value={amount} onChange={e => setAmount(e.target.value)} className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] text-white placeholder:text-[#8888aa]" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-200">Referencia / Comprobante</Label>
                      <Input placeholder="Número de referencia o folio" value={reference} onChange={e => setReference(e.target.value)} className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] text-white placeholder:text-[#8888aa]" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-200">Notas (opcional)</Label>
                      <Textarea placeholder="Información adicional..." value={depositNotes} onChange={e => setDepositNotes(e.target.value)} className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] text-white placeholder:text-[#8888aa]" />
                    </div>
                    <Button onClick={handleDeposit} className="w-full bg-[#00f0ff] text-[#07070d] hover:bg-[#00d4e0] font-semibold" disabled={submitting}>
                      {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CreditCard className="w-4 h-4 mr-2" />}
                      {submitting ? 'Enviando...' : 'Solicitar Recarga'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Transactions */}
        <Card className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-white">Historial de Transacciones</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-[#8888aa]">
                <Wallet className="w-12 h-12 mx-auto mb-3" />
                <p>No hay transacciones</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {transactions.map(tx => {
                  const typeConf = typeConfig[tx.type] || typeConfig.deposit;
                  const statusConf = statusConfig[tx.status] || statusConfig.pending;
                  const isPositive = tx.amount > 0;
                  
                  return (
                    <div key={tx.id} className="flex items-center justify-between p-3 bg-[#13131f] rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${isPositive ? 'bg-[rgba(0,240,255,0.1)]' : 'bg-[rgba(255,50,50,0.05)]'} rounded-lg flex items-center justify-center`}>
                          <typeConf.icon className={`w-4 h-4 ${typeConf.color}`} />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-white">
                            {typeConf.label}
                            {tx.order?.service?.name && ` - ${tx.order.service.name}`}
                          </p>
                          <p className="text-xs text-[#8888aa]">{new Date(tx.createdAt).toLocaleDateString('es-MX')}</p>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-2">
                        <Badge className={`${statusConf.color} border-0 text-xs`}>{statusConf.label}</Badge>
                        <span className={`font-semibold text-sm ${isPositive ? 'text-[#00f0ff]' : 'text-red-400'}`}>
                          {isPositive ? '+' : ''}{typeof tx.amount === 'number' ? tx.amount.toFixed(2) : tx.amount}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
