'use client';

import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { Package, Wallet, Clock, CheckCircle, XCircle, ArrowRight, FileText, TrendingUp } from 'lucide-react';

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'Pendiente', color: 'bg-[rgba(255,200,0,0.1)] text-[#ffc800]', icon: Clock },
  processing: { label: 'En Proceso', color: 'bg-[rgba(0,240,255,0.1)] text-[#00f0ff]', icon: TrendingUp },
  completed: { label: 'Completado', color: 'bg-[rgba(57,255,20,0.1)] text-[#39ff14]', icon: CheckCircle },
  cancelled: { label: 'Cancelado', color: 'bg-[rgba(255,50,50,0.1)] text-[#ff3232]', icon: XCircle },
};

export function DashboardView() {
  const { user, orders, transactions, fetchOrders, fetchTransactions, setView } = useStore();

  useEffect(() => {
    fetchOrders();
    fetchTransactions();
  }, [fetchOrders, fetchTransactions]);

  if (!user) return null;

  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const processingOrders = orders.filter(o => o.status === 'processing').length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;

  const stats = [
    { label: 'Saldo', value: `$${user.balance.toFixed(2)}`, icon: Wallet, color: 'text-[#00f0ff]', bg: 'bg-[rgba(0,240,255,0.1)]' },
    { label: 'Pendientes', value: pendingOrders, icon: Clock, color: 'text-[#ffc800]', bg: 'bg-[rgba(255,200,0,0.1)]' },
    { label: 'En Proceso', value: processingOrders, icon: TrendingUp, color: 'text-[#00f0ff]', bg: 'bg-[rgba(0,240,255,0.1)]' },
    { label: 'Completados', value: completedOrders, icon: CheckCircle, color: 'text-[#39ff14]', bg: 'bg-[rgba(57,255,20,0.1)]' },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">¡Hola, {user.name}!</h1>
            <p className="text-[#8888aa]">Bienvenido a tu panel de trámites</p>
          </div>
          <Button onClick={() => setView('services')} className="bg-[#00f0ff] text-[#07070d] hover:bg-[#00d4e0] font-semibold">
            <FileText className="w-4 h-4 mr-2" /> Nuevo Trámite
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] shadow-sm">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center`}>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-sm text-[#8888aa]">{stat.label}</p>
                      <p className="text-xl font-bold text-white">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => setView('dashboard-orders')}>
            <CardContent className="pt-4 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-[#00f0ff]" />
                <span className="font-medium text-white">Mis Pedidos</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#8888aa]" />
            </CardContent>
          </Card>
          <Card className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => setView('dashboard-wallet')}>
            <CardContent className="pt-4 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wallet className="w-5 h-5 text-[#00f0ff]" />
                <span className="font-medium text-white">Mi Billetera</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#8888aa]" />
            </CardContent>
          </Card>
          <Card className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => setView('services')}>
            <CardContent className="pt-4 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#00f0ff]" />
                <span className="font-medium text-white">Solicitar Servicio</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#8888aa]" />
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-white">Pedidos Recientes</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setView('dashboard-orders')} className="text-[#00f0ff]">
              Ver todos <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <div className="text-center py-8 text-[#8888aa]">
                <Package className="w-12 h-12 mx-auto mb-3" />
                <p>Aún no tienes pedidos</p>
                <Button variant="outline" onClick={() => setView('services')} className="mt-3 border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff] hover:text-[#07070d]">Ver Servicios</Button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map(order => {
                  const config = statusConfig[order.status] || statusConfig.pending;
                  return (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-[#13131f] rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${config.color.split(' ')[0]} rounded-lg flex items-center justify-center`}>
                          <config.icon className={`w-4 h-4 ${config.color.split(' ')[1]}`} />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-white">{order.service?.name || 'Servicio'}</p>
                          <p className="text-xs text-[#8888aa]">{new Date(order.createdAt).toLocaleDateString('es-MX')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={`${config.color} border-0 text-xs`}>{config.label}</Badge>
                        <p className="text-sm font-semibold text-gray-200 mt-1">${order.total.toFixed(2)}</p>
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
