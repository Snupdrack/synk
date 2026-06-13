'use client';

import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ArrowLeft, Clock, CheckCircle, XCircle, TrendingUp, Package, AlertCircle, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'Pendiente', color: 'bg-[rgba(255,200,0,0.1)] text-[#ffc800]', icon: Clock },
  processing: { label: 'En Proceso', color: 'bg-[rgba(0,240,255,0.1)] text-[#00f0ff]', icon: TrendingUp },
  completed: { label: 'Completado', color: 'bg-[rgba(57,255,20,0.1)] text-[#39ff14]', icon: CheckCircle },
  cancelled: { label: 'Cancelado', color: 'bg-[rgba(255,50,50,0.1)] text-[#ff3232]', icon: XCircle },
};

export function DashboardOrders() {
  const { orders, fetchOrders, setView } = useStore();
  const { toast } = useToast();
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleCancel = async (orderId: string) => {
    setCancelling(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });
      if (res.ok) {
        toast({ title: 'Pedido cancelado', description: 'Se ha reembolsado el saldo a tu cuenta' });
        await fetchOrders();
      } else {
        const data = await res.json();
        toast({ title: 'Error', description: data.error, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Error de conexión', variant: 'destructive' });
    } finally {
      setCancelling(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Button variant="ghost" onClick={() => setView('dashboard')} className="mb-4 text-[#8888aa] hover:text-[#00f0ff]">
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver al panel
        </Button>
        <h1 className="text-2xl font-bold text-white mb-6">Mis Pedidos</h1>

        {orders.length === 0 ? (
          <Card className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] shadow-sm">
            <CardContent className="py-16 text-center">
              <Package className="w-12 h-12 text-[#8888aa] mx-auto mb-4" />
              <p className="text-[#8888aa] mb-4">Aún no tienes pedidos</p>
              <Button onClick={() => setView('services')} className="bg-[#00f0ff] text-[#07070d] hover:bg-[#00d4e0]">Ver Servicios</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map(order => {
              const config = statusConfig[order.status] || statusConfig.pending;
              const isExpanded = expanded === order.id;
              const canCancel = order.status === 'pending' || order.status === 'processing';

              return (
                <Card key={order.id} className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] shadow-sm">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${config.color.split(' ')[0]} rounded-lg flex items-center justify-center`}>
                          <config.icon className={`w-5 h-5 ${config.color.split(' ')[1]}`} />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{order.service?.name || 'Servicio'}</p>
                          <p className="text-xs text-[#8888aa]">ID: {order.id.slice(-8)} · {new Date(order.createdAt).toLocaleDateString('es-MX')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <Badge className={`${config.color} border-0`}>{config.label}</Badge>
                          <p className="text-sm font-bold text-gray-200 mt-1">${order.total.toFixed(2)}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setExpanded(isExpanded ? null : order.id)} className="text-[#8888aa]">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-[rgba(0,240,255,0.12)] space-y-3">
                        {order.service?.description && (
                          <p className="text-sm text-[#8888aa]">{order.service.description}</p>
                        )}
                        {order.adminNotes && (
                          <Alert className="bg-[rgba(0,240,255,0.05)] border-[rgba(0,240,255,0.15)]">
                            <AlertCircle className="h-4 w-4 text-[#00f0ff]" />
                            <AlertDescription className="text-[#00f0ff] text-sm">
                              <strong>Nota del administrador:</strong> {order.adminNotes}
                            </AlertDescription>
                          </Alert>
                        )}
                        {order.notes && (
                          <p className="text-sm text-[#8888aa]"><strong>Tu nota:</strong> {order.notes}</p>
                        )}
                        {canCancel && (
                          <Button variant="outline" size="sm" className="text-red-400 border-[rgba(255,50,50,0.3)] hover:bg-[rgba(255,50,50,0.1)]"
                            onClick={() => handleCancel(order.id)} disabled={cancelling === order.id}>
                            {cancelling === order.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <XCircle className="w-4 h-4 mr-2" />}
                            Cancelar Pedido
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
