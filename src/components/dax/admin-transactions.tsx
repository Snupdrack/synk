'use client';

import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Clock } from 'lucide-react';
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
                          {tx.type === 'deposit' && tx.status === 'pending' ? (
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="sm" className="text-[#39ff14] hover:text-[#39ff14]/80" onClick={() => handleAction(tx.id, 'approved')}>
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300" onClick={() => handleAction(tx.id, 'rejected')}>
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <span className="text-xs text-[#8888aa]">-</span>
                          )}
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
    </div>
  );
}
