'use client';

import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { Users, Package, FileText, DollarSign, Clock, Settings, ArrowRight, TrendingUp, AlertCircle, CreditCard, BarChart3 } from 'lucide-react';

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pendiente', color: 'bg-[rgba(255,200,0,0.1)] text-[#ffc800]' },
  processing: { label: 'En Proceso', color: 'bg-[rgba(0,240,255,0.1)] text-[#00f0ff]' },
  completed: { label: 'Completado', color: 'bg-[rgba(57,255,20,0.1)] text-[#39ff14]' },
  cancelled: { label: 'Cancelado', color: 'bg-[rgba(255,50,50,0.1)] text-[#ff3232]' },
};

export function AdminView() {
  const { adminStats, fetchAdminStats, setView } = useStore();

  useEffect(() => { fetchAdminStats(); }, [fetchAdminStats]);

  const stats = [
    { label: 'Usuarios', value: adminStats?.totalUsers || 0, icon: Users, color: 'text-[#00f0ff]', bg: 'bg-[rgba(0,240,255,0.1)]' },
    { label: 'Pedidos', value: adminStats?.totalOrders || 0, icon: Package, color: 'text-[#00f0ff]', bg: 'bg-[rgba(0,240,255,0.1)]' },
    { label: 'Servicios', value: adminStats?.totalServices || 0, icon: FileText, color: 'text-[#9d00ff]', bg: 'bg-[rgba(157,0,255,0.1)]' },
    { label: 'Ingresos', value: `$${(adminStats?.totalRevenue || 0).toFixed(2)}`, icon: DollarSign, color: 'text-[#39ff14]', bg: 'bg-[rgba(57,255,20,0.1)]' },
  ];

  const navCards = [
    { label: 'Servicios', desc: 'Gestionar catálogo', view: 'admin-services' as const, icon: FileText },
    { label: 'Pedidos', desc: `${adminStats?.pendingOrders || 0} pendientes`, view: 'admin-orders' as const, icon: Package },
    { label: 'Usuarios', desc: 'Gestionar cuentas', view: 'admin-users' as const, icon: Users },
    { label: 'Transacciones', desc: `${adminStats?.pendingDeposits || 0} recargas pendientes`, view: 'admin-transactions' as const, icon: CreditCard },
    { label: 'Configuración', desc: 'Ajustes del sistema', view: 'admin-settings' as const, icon: Settings },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[rgba(0,240,255,0.1)] rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-[#00f0ff]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Panel de Administración</h1>
            <p className="text-[#8888aa] text-sm">Resumen general del sistema</p>
          </div>
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

        {/* Alert for pending items */}
        {(adminStats?.pendingOrders > 0 || adminStats?.pendingDeposits > 0) && (
          <Card className="border-[rgba(255,200,0,0.3)] bg-[rgba(255,200,0,0.05)] mb-6">
            <CardContent className="pt-4 pb-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-[#ffc800]" />
              <div>
                <p className="font-medium text-[#ffc800]">Atención requerida</p>
                <p className="text-sm text-[#ffc800]/70">
                  {adminStats?.pendingOrders > 0 && `${adminStats.pendingOrders} pedido(s) pendiente(s) · `}
                  {adminStats?.pendingDeposits > 0 && `${adminStats.pendingDeposits} recarga(s) por aprobar`}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Nav Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
          {navCards.map(card => (
            <Card key={card.view} className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => setView(card.view)}>
              <CardContent className="pt-4 pb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <card.icon className="w-5 h-5 text-[#00f0ff]" />
                  <div>
                    <p className="font-medium text-sm text-white">{card.label}</p>
                    <p className="text-xs text-[#8888aa]">{card.desc}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#8888aa]" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Orders */}
        <Card className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-white">Pedidos Recientes</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setView('admin-orders')} className="text-[#00f0ff]">Ver todos</Button>
          </CardHeader>
          <CardContent>
            {(adminStats?.recentOrders || []).length === 0 ? (
              <p className="text-[#8888aa] text-center py-4">No hay pedidos</p>
            ) : (
              <div className="space-y-2">
                {adminStats.recentOrders.map((order: any) => {
                  const config = statusConfig[order.status] || statusConfig.pending;
                  return (
                    <div key={order.id} className="flex items-center justify-between p-2 bg-[#13131f] rounded-lg text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{order.user?.name}</span>
                        <span className="text-[#8888aa]">·</span>
                        <span className="text-[#8888aa]">{order.service?.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${config.color} border-0 text-xs`}>{config.label}</Badge>
                        <span className="font-semibold text-white">${order.total?.toFixed(2)}</span>
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
