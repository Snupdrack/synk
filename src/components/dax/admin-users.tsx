'use client';

import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ArrowLeft, Pencil, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function AdminUsers() {
  const { adminUsers, fetchAdminUsers, setView } = useStore();
  const { toast } = useToast();
  const [editOpen, setEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editForm, setEditForm] = useState({ name: '', phone: '', role: '', balance: '', active: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchAdminUsers(); }, [fetchAdminUsers]);

  const openEdit = (user: any) => {
    setEditingUser(user);
    setEditForm({ name: user.name, phone: user.phone || '', role: user.role, balance: String(user.balance), active: user.active });
    setEditOpen(true);
  };

  const handleSave = async () => {
    if (!editingUser) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editForm, balance: parseFloat(editForm.balance) || 0 }),
      });
      if (res.ok) {
        toast({ title: 'Usuario actualizado' });
        setEditOpen(false);
        await fetchAdminUsers();
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
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" onClick={() => setView('admin')} className="text-[#8888aa] hover:text-[#00f0ff]"><ArrowLeft className="w-4 h-4 mr-2" />Admin</Button>
          <h1 className="text-2xl font-bold text-white">Usuarios</h1>
        </div>

        <Card className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[rgba(0,240,255,0.12)] hover:bg-transparent">
                    <TableHead className="text-[#8888aa]">Nombre</TableHead>
                    <TableHead className="text-[#8888aa]">Email</TableHead>
                    <TableHead className="text-[#8888aa]">Teléfono</TableHead>
                    <TableHead className="text-[#8888aa]">Rol</TableHead>
                    <TableHead className="text-[#8888aa]">Saldo</TableHead>
                    <TableHead className="text-[#8888aa]">Estado</TableHead>
                    <TableHead className="text-[#8888aa]">Registro</TableHead>
                    <TableHead className="text-right text-[#8888aa]">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminUsers.map((user: any) => (
                    <TableRow key={user.id} className="border-[rgba(0,240,255,0.12)] hover:bg-[#13131f]">
                      <TableCell className="font-medium text-white">{user.name}</TableCell>
                      <TableCell className="text-sm text-gray-200">{user.email}</TableCell>
                      <TableCell className="text-sm text-[#8888aa]">{user.phone || '-'}</TableCell>
                      <TableCell>
                        <Badge className={user.role === 'admin' ? 'bg-[rgba(157,0,255,0.1)] text-[#9d00ff] border-0' : 'bg-[rgba(0,240,255,0.1)] text-[#00f0ff] border-0'}>
                          {user.role === 'admin' ? 'Admin' : 'Usuario'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-[#00f0ff]">${user.balance?.toFixed(2)}</TableCell>
                      <TableCell><Badge className={user.active ? 'bg-[rgba(57,255,20,0.1)] text-[#39ff14] border-0' : 'bg-[rgba(255,50,50,0.1)] text-[#ff3232] border-0'}>{user.active ? 'Activo' : 'Inactivo'}</Badge></TableCell>
                      <TableCell className="text-xs text-[#8888aa]">{new Date(user.createdAt).toLocaleDateString('es-MX')}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(user)} className="text-[#8888aa] hover:text-[#00f0ff]"><Pencil className="w-3 h-3" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)]">
            <DialogHeader>
              <DialogTitle className="text-white">Editar Usuario</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Nombre</label>
                <Input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Teléfono</label>
                <Input value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200">Rol</label>
                  <select className="w-full border border-[rgba(0,240,255,0.12)] rounded-md px-3 py-2 text-sm bg-[#0f0f1a] text-white" value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value})}>
                    <option value="user">Usuario</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200">Saldo</label>
                  <Input type="number" value={editForm.balance} onChange={e => setEditForm({...editForm, balance: e.target.value})} className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] text-white" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={editForm.active} onCheckedChange={v => setEditForm({...editForm, active: v})} />
                <label className="text-sm font-medium text-gray-200">Activo</label>
              </div>
              <Button onClick={handleSave} className="w-full bg-[#00f0ff] text-[#07070d] hover:bg-[#00d4e0] font-semibold" disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}
