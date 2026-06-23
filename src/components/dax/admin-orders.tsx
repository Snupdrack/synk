'use client';

import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ArrowLeft, Pencil, Loader2, ClipboardList } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const statusConfig: Record<string, { label: string; color: string }> = {
  pending:    { label: 'Pendiente',  color: 'bg-[rgba(255,200,0,0.1)] text-[#ffc800]' },
  processing: { label: 'En Proceso', color: 'bg-[rgba(0,240,255,0.1)] text-[#00f0ff]' },
  completed:  { label: 'Completado', color: 'bg-[rgba(57,255,20,0.1)] text-[#39ff14]' },
  cancelled:  { label: 'Cancelado',  color: 'bg-[rgba(255,50,50,0.1)] text-[#ff3232]' },
};

function FormDataSection({ raw }: { raw?: string }) {
  let fd: Record<string, string> = {};
  try { fd = JSON.parse(raw || '{}'); } catch {}

  const entries = Object.entries(fd).filter(([key, v]) => v && !key.endsWith('_name'));
  if (entries.length === 0) return null;

  return (
    <div className="border border-[rgba(0,240,255,0.2)] rounded-lg p-3 bg-[#07070d]">
      <div className="flex items-center gap-2 mb-3">
        <ClipboardList className="w-4 h-4 text-[#00f0ff]" />
        <p className="text-xs font-semibold text-[#00f0ff] uppercase tracking-wide">
          Datos enviados por el cliente
        </p>
      </div>
      <div className="space-y-2">
        {entries.map(([key, value]) => {
          const label = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
          const isFile = String(value).startsWith('data:');
          const fileName = fd[`${key}_name`] || `archivo_${key}`;
          return (
            <div key={key} className="grid grid-cols-[130px_1fr] gap-2 items-start">
              <span className="text-xs text-[#8888aa]">{label}:</span>
              {isFile ? (
                <a
                  href={String(value)}
                  download={fileName}
                  className="text-xs text-[#00f0ff] hover:underline flex items-center gap-1"
                >
                  📎 {fileName}
                </a>
              ) : (
                <span className="text-xs text-white font-medium break-all">{String(value)}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AdminOrders() {
  const { adminOrders, fetchAdminOrders, setView } = useStore();
  const { toast } = useToast();
  const [editOpen, setEditOpen]       = useState(false);
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [newStatus, setNewStatus]     = useState('');
  const [adminNotes, setAdminNotes]   = useState('');
  const [saving, setSaving]           = useState(false);
  const [filter, setFilter]           = useState('all');

  useEffect(() => { fetchAdminOrders(); }, [fetchAdminOrders]);

  const filteredOrders = filter === 'all'
    ? adminOrders
    : adminOrders.filter((o: any) => o.status === filter);

  const openEdit = (order: any) => {
    setEditingOrder(order);
    setNewStatus(order.status);
    setAdminNotes(order.adminNotes || '');
    setEditOpen(true);
  };

  const handleSave = async () => {
    if (!editingOrder) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${editingOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, adminNotes }),
      });
      if (res.ok) {
        toast({ title: 'Pedido actualizado' });
        setEditOpen(false);
        await fetchAdminOrders();
      } else {
        toast({ title: 'Error', description: 'Error al actualizar', variant: 'destructive' });
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

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => setView('admin')} className="text-[#8888aa] hover:text-[#00f0ff]">
              <ArrowLeft className="w-4 h-4 mr-2" />Admin
            </Button>
            <h1 className="text-2xl font-bold text-white">Pedidos</h1>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40 bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] text-white">
              <SelectValue placeholder="Filtrar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
              <SelectItem value="processing">En Proceso</SelectItem>
              <SelectItem value="completed">Completados</SelectItem>
              <SelectItem value="cancelled">Cancelados</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Card className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[rgba(0,240,255,0.12)] hover:bg-transparent">
                    <TableHead className="text-[#8888aa]">ID</TableHead>
                    <TableHead className="text-[#8888aa]">Cliente</TableHead>
                    <TableHead className="text-[#8888aa]">Servicio</TableHead>
                    <TableHead className="text-[#8888aa]">Total</TableHead>
                    <TableHead className="text-[#8888aa]">Estado</TableHead>
                    <TableHead className="text-[#8888aa]">Fecha</TableHead>
                    <TableHead className="text-right text-[#8888aa]">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order: any) => {
                    const config = statusConfig[order.status] || statusConfig.pending;
                    return (
                      <TableRow key={order.id} className="border-[rgba(0,240,255,0.12)] hover:bg-[#13131f]">
                        <TableCell className="font-mono text-xs text-[#8888aa]">{order.id.slice(-8)}</TableCell>
                        <TableCell>
                          <p className="font-medium text-sm text-white">{order.user?.name}</p>
                          <p className="text-xs text-[#8888aa]">{order.user?.email}</p>
                        </TableCell>
                        <TableCell className="text-sm text-gray-200">{order.service?.name}</TableCell>
                        <TableCell className="font-semibold text-[#00f0ff]">${order.total?.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge className={`${config.color} border-0`}>{config.label}</Badge>
                        </TableCell>
                        <TableCell className="text-xs text-[#8888aa]">
                          {new Date(order.createdAt).toLocaleDateString('es-MX')}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => openEdit(order)} className="text-[#8888aa] hover:text-[#00f0ff]">
                            <Pencil className="w-3 h-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filteredOrders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-[#8888aa] py-8">
                        No hay pedidos
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] max-w-lg w-full p-0 overflow-hidden">
            <DialogHeader className="px-6 pt-6 pb-0">
              <DialogTitle className="text-white">
                Actualizar Pedido <span className="font-mono text-[#00f0ff]">{editingOrder?.id?.slice(-8)}</span>
              </DialogTitle>
            </DialogHeader>

            <ScrollArea className="max-h-[75vh]">
              <div className="px-6 py-4 space-y-4">

                {/* Info básica */}
                <div className="space-y-1">
                  <p className="text-sm text-[#8888aa]">Cliente: <strong className="text-white">{editingOrder?.user?.name}</strong></p>
                  <p className="text-sm text-[#8888aa]">Email: <strong className="text-white">{editingOrder?.user?.email}</strong></p>
                  <p className="text-sm text-[#8888aa]">Servicio: <strong className="text-white">{editingOrder?.service?.name}</strong></p>
                  <p className="text-sm text-[#8888aa]">Total: <strong className="text-[#00f0ff]">${editingOrder?.total?.toFixed(2)}</strong></p>
                  {editingOrder?.notes && (
                    <p className="text-sm text-[#8888aa]">Notas cliente: <strong className="text-white">{editingOrder.notes}</strong></p>
                  )}
                </div>

                {/* Datos del formulario */}
                <FormDataSection raw={editingOrder?.formData} />

                {/* Estado */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200">Estado</label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="processing">En Proceso</SelectItem>
                      <SelectItem value="completed">Completado</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Notas admin */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200">Notas del administrador</label>
                  <Textarea
                    value={adminNotes}
                    onChange={e => setAdminNotes(e.target.value)}
                    placeholder="Agregar nota para el cliente..."
                    className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] text-white placeholder:text-[#8888aa]"
                  />
                </div>

                {/* Guardar */}
                <Button
                  onClick={handleSave}
                  className="w-full bg-[#00f0ff] text-[#07070d] hover:bg-[#00d4e0] font-semibold"
                  disabled={saving}
                >
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </Button>

              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

      </motion.div>
    </div>
  );
}
