'use client';

import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Clock, Pencil, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const typeConfig: Record<string, { label: string; color: string }> = {
  deposit: { label: 'Recarga', color: 'bg-[rgba(0,240,255,0.1)] text-[#00f0ff]' },
  payment: { label: 'Pago', color: 'bg-[rgba(255,50,50,0.1)] text-[#ff3232]' },
  refund: { label: 'Reembolso', color: 'bg-[rgba(0,240,255,0.1)] text-[#00f0ff]' },
};

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pendiente', color: 'bg-[rgba(255,200,0,0.1)] text-[#ffc800]' },
  approved: { label: 'Aprobado', color: 'bg-[rgba(57,255,20,0.1)] text-[#39ff14]' },
  rejected: { label: 'Rechazado', color: 'bg-[rgba(255,50,50,0.1)] text-[#ff3232]' },
};

export function AdminTransactions() {
  const { adminTransactions, fetchAdminTransactions, setView } = useStore();
  const { toast } = useToast();

  const [editOpen, setEditOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<any>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editType, setEditType] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editReference, setEditReference] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchAdminTransactions(); }, [fetchAdminTransactions]);

  const handleAction = async (id: string, action: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`/api/admin/transactions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action }),
      });
      if (res.ok) {
        toast({ title: action === 'approved' ? 'Depósito aprobado' : 'Depósito rechazado' });
        await fetchAdminTransactions();
      } else {
        toast({ title: 'Error', description: 'Error al actualizar', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Error de conexión', variant: 'destructive' });
    }
  };

  const openEdit = (tx: any) => {
    setEditingTx(tx);
    setEditAmount(String(tx.amount ?? ''));
    setEditType(tx.type ?? 'deposit');
    setEditStatus(tx.status ?? 'pending');
    setEditReference(tx.reference ?? '');
    setEditNotes(tx.notes ?? '');
    setEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingTx) return;
    const parsedAmount = parseFloat(editAmount);
    if (Number.isNaN(parsedAmount)) {
      toast({ title: 'Error', description: 'El monto debe ser un número válido', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/transactions/${editingTx.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parsedAmount,
          type: editType,
          status: editStatus,
          reference: editReference,
          notes: editNotes,
        }),
      });
      if (res.ok) {
        toast({ title: 'Datos de pago actualizados' });
        setEditOpen(false);
        await fetchAdminTransactions();
      } else {
        const data = await res.json().catch(() => ({}));
        toast({ title: 'Error', description: data.error || 'Error al actualizar', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Error de conexión', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" onClick={() => setView('admin')} className="text-[#8888aa] hover:text-[#00f0ff]"><ArrowLeft className="w-4 h-4 mr-2" />Admin</Button>
          <h1 className="text-2xl font-bold text-white">Transacciones</h1>
        </div>

        <Card className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[rgba(0,240,255,0.12)] hover:bg-transparent">
                    <TableHead className="text-[#8888aa]">ID</TableHead>
                    <TableHead className="text-[#8888aa]">Usuario</TableHead>
                    <TableHead className="text-[#8888aa]">Tipo</TableHead>
                    <TableHead className="text-[#8888aa]">Monto</TableHead>
                    <TableHead className="text-[#8888aa]">Referencia</TableHead>
                    <TableHead className="text-[#8888aa]">Estado</TableHead>
                    <TableHead className="text-[#8888aa]">Fecha</TableHead>
                    <TableHead className="text-right text-[#8888aa]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminTransactions.map((tx: any) => {
                    const typeConf = typeConfig[tx.type] || typeConfig.deposit;
                    const statusConf = statusConfig[tx.status] || statusConfig.pending;
                    return (
                      <TableRow key={tx.id} className="border-[rgba(0,240,255,0.12)] hover:bg-[#13131f]">
                        <TableCell className="font-mono text-xs text-[#8888aa]">{tx.id.slice(-8)}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm text-white">{tx.user?.name}</p>
                            <p className="text-xs text-[#8888aa]">{tx.user?.email}</p>
                          </div>
                        </TableCell>
                        <TableCell><Badge className={`${typeConf.color} border-0`}>{typeConf.label}</Badge></TableCell>
                        <TableCell className={`font-semibold ${tx.amount > 0 ? 'text-[#00f0ff]' : 'text-red-400'}`}>
                          {tx.amount > 0 ? '+' : ''}{tx.amount?.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-sm text-gray-200">{tx.reference || '-'}</TableCell>
                        <TableCell><Badge className={`${statusConf.color} border-0`}>{statusConf.label}</Badge></TableCell>
                        <TableCell className="text-xs text-[#8888aa]">{new Date(tx.createdAt).toLocaleDateString('es-MX')}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            {tx.type === 'deposit' && tx.status === 'pending' && (
                              <>
                                <Button variant="ghost" size="sm" className="text-[#39ff14] hover:text-[#39ff14]/80" onClick={() => handleAction(tx.id, 'approved')}>
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300" onClick={() => handleAction(tx.id, 'rejected')}>
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                            <Button variant="ghost" size="sm" className="text-[#8888aa] hover:text-[#00f0ff]" onClick={() => openEdit(tx)}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] max-w-lg w-full p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-0">
            <DialogTitle className="text-white">
              Editar datos de pago <span className="font-mono text-[#00f0ff]">{editingTx?.id?.slice(-8)}</span>
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[75vh]">
            <div className="px-6 py-4 space-y-4">

              {/* Info básica */}
              <div className="space-y-1">
                <p className="text-sm text-[#8888aa]">Usuario: <strong className="text-white">{editingTx?.user?.name}</strong></p>
                <p className="text-sm text-[#8888aa]">Email: <strong className="text-white">{editingTx?.user?.email}</strong></p>
                {editingTx?.createdAt && (
                  <p className="text-sm text-[#8888aa]">Fecha: <strong className="text-white">{new Date(editingTx.createdAt).toLocaleString('es-MX')}</strong></p>
                )}
              </div>

              {/* Monto */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Monto</label>
                <Input
                  type="number"
                  step="0.01"
                  value={editAmount}
                  onChange={e => setEditAmount(e.target.value)}
                  className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] text-white"
                />
              </div>

              {/* Tipo */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Tipo</label>
                <Select value={editType} onValueChange={setEditType}>
                  <SelectTrigger className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deposit">Recarga</SelectItem>
                    <SelectItem value="payment">Pago</SelectItem>
                    <SelectItem value="refund">Reembolso</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Estado */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Estado</label>
                <Select value={editStatus} onValueChange={setEditStatus}>
                  <SelectTrigger className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="approved">Aprobado</SelectItem>
                    <SelectItem value="rejected">Rechazado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Referencia */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Referencia / Comprobante</label>
                <Input
                  value={editReference}
                  onChange={e => setEditReference(e.target.value)}
                  placeholder="Referencia de pago"
                  className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] text-white placeholder:text-[#8888aa]"
                />
              </div>

              {/* Notas */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Notas</label>
                <Textarea
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  placeholder="Notas internas..."
                  className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] text-white placeholder:text-[#8888aa]"
                />
              </div>

              {/* Guardar */}
              <Button
                onClick={handleSaveEdit}
                className="w-full bg-[#00f0ff] text-[#07070d] hover:bg-[#00d4e0] font-semibold"
                disabled={saving}
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Guardar cambios'}
              </Button>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
