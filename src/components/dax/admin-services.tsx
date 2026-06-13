'use client';

import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ArrowLeft, Plus, Pencil, Trash2, FileText, Loader2, X, GripVertical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FieldDef {
  key: string;
  label: string;
  type: string;
  required: boolean;
  placeholder: string;
  options?: string[];
}

const emptyField: FieldDef = { key: '', label: '', type: 'text', required: true, placeholder: '' };

export function AdminServices() {
  const { services, fetchServices, setView } = useStore();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', price: '', deliveryTime: '', categorySlug: '', icon: 'FileText', sortOrder: '0', active: true,
  });
  const [fields, setFields] = useState<FieldDef[]>([]);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', deliveryTime: '', categorySlug: '', icon: 'FileText', sortOrder: '0', active: true });
    setFields([]);
    setEditingId(null);
  };

  const openEdit = (service: any) => {
    setForm({
      name: service.name, description: service.description, price: String(service.price),
      deliveryTime: service.deliveryTime, categorySlug: service.categorySlug || service.category?.slug || '', icon: service.icon,
      sortOrder: String(service.sortOrder), active: service.active,
    });
    
    let parsedFields = [];
    try {
      parsedFields = typeof service.fields === 'string' ? JSON.parse(service.fields || '[]') : service.fields;
      if (!Array.isArray(parsedFields)) parsedFields = [];
    } catch (e) {
      console.error('Error parsing service fields in admin:', e);
    }
    setFields(parsedFields);
    setEditingId(service.id);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) {
      toast({ title: 'Error', description: 'Nombre y precio son requeridos', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const url = editingId ? `/api/admin/services/${editingId}` : '/api/admin/services';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, price: parseFloat(form.price), sortOrder: parseInt(form.sortOrder), fields }),
      });
      if (res.ok) {
        toast({ title: editingId ? 'Servicio actualizado' : 'Servicio creado' });
        setDialogOpen(false);
        resetForm();
        await fetchServices();
      } else {
        toast({ title: 'Error', description: 'Error al guardar', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Error de conexión', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este servicio?')) return;
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast({ title: 'Servicio eliminado' });
        await fetchServices();
      }
    } catch {
      toast({ title: 'Error', description: 'Error al eliminar', variant: 'destructive' });
    }
  };

  const handleToggle = async (service: any) => {
    try {
      await fetch(`/api/admin/services/${service.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !service.active }),
      });
      await fetchServices();
    } catch {}
  };

  const addField = () => setFields([...fields, { ...emptyField }]);
  const removeField = (i: number) => setFields(fields.filter((_, idx) => idx !== i));
  const updateField = (i: number, key: string, value: any) => {
    const updated = [...fields];
    updated[i] = { ...updated[i], [key]: value };
    setFields(updated);
  };

  const iconOptions = ['FileText', 'CreditCard', 'Building', 'Heart', 'Shield', 'Plane', 'Receipt', 'FileCheck'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => setView('admin')} className="text-[#8888aa] hover:text-[#00f0ff]"><ArrowLeft className="w-4 h-4 mr-2" />Admin</Button>
            <h1 className="text-2xl font-bold text-white">Servicios</h1>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => { 
            setDialogOpen(open); 
            if (open && !editingId) resetForm();
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-[#00f0ff] text-[#07070d] hover:bg-[#00d4e0] font-semibold">
                <Plus className="w-4 h-4 mr-2" /> Agregar Servicio
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0f0f1a] border-[rgba(0,240,255,0.12)]">
              <DialogHeader>
                <DialogTitle className="text-white">{editingId ? 'Editar Servicio' : 'Nuevo Servicio'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-200">Nombre</Label>
                    <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Acta de Nacimiento" className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] text-white placeholder:text-[#8888aa]" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-200">Precio (MXN)</Label>
                    <Input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="299" className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] text-white placeholder:text-[#8888aa]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-200">Descripción</Label>
                  <Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Descripción del servicio..." className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] text-white placeholder:text-[#8888aa]" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-200">Categoría (slug)</Label>
                    <Input value={form.categorySlug} onChange={e => setForm({...form, categorySlug: e.target.value})} placeholder="actas" className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] text-white placeholder:text-[#8888aa]" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-200">Tiempo de Entrega</Label>
                    <Input value={form.deliveryTime} onChange={e => setForm({...form, deliveryTime: e.target.value})} placeholder="3-5 días" className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] text-white placeholder:text-[#8888aa]" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-200">Icono</Label>
                    <Select value={form.icon} onValueChange={v => setForm({...form, icon: v})}>
                      <SelectTrigger className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] text-white"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {iconOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-200">Orden</Label>
                    <Input type="number" value={form.sortOrder} onChange={e => setForm({...form, sortOrder: e.target.value})} className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] text-white" />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <Switch checked={form.active} onCheckedChange={v => setForm({...form, active: v})} />
                    <Label className="text-gray-200">Activo</Label>
                  </div>
                </div>

                <Separator className="bg-[rgba(0,240,255,0.12)]" />
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-base font-semibold text-white">Campos Requeridos</Label>
                    <Button variant="outline" size="sm" onClick={addField} className="border-[rgba(0,240,255,0.12)] text-[#00f0ff] hover:bg-[#00f0ff] hover:text-[#07070d]"><Plus className="w-3 h-3 mr-1" />Agregar Campo</Button>
                  </div>
                  <div className="space-y-3">
                    {fields.map((field, i) => (
                      <div key={i} className="grid grid-cols-12 gap-2 items-end bg-[#13131f] p-3 rounded-lg">
                        <div className="col-span-3 space-y-1">
                          <Label className="text-xs text-[#8888aa]">Key</Label>
                          <Input value={field.key} onChange={e => updateField(i, 'key', e.target.value)} placeholder="curp" className="text-sm h-8 bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] text-white placeholder:text-[#8888aa]" />
                        </div>
                        <div className="col-span-3 space-y-1">
                          <Label className="text-xs text-[#8888aa]">Etiqueta</Label>
                          <Input value={field.label} onChange={e => updateField(i, 'label', e.target.value)} placeholder="CURP" className="text-sm h-8 bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] text-white placeholder:text-[#8888aa]" />
                        </div>
                        <div className="col-span-2 space-y-1">
                          <Label className="text-xs text-[#8888aa]">Tipo</Label>
                          <Select value={field.type} onValueChange={v => updateField(i, 'type', v)}>
                            <SelectTrigger className="h-8 text-sm bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] text-white"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Texto</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="date">Fecha</SelectItem>
                              <SelectItem value="select">Selección</SelectItem>
                              <SelectItem value="password">Contraseña</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-1 flex items-center justify-center pt-4">
                          <Switch checked={field.required} onCheckedChange={v => updateField(i, 'required', v)} />
                        </div>
                        <div className="col-span-2 space-y-1">
                          <Label className="text-xs text-[#8888aa]">Placeholder</Label>
                          <Input value={field.placeholder} onChange={e => updateField(i, 'placeholder', e.target.value)} className="text-sm h-8 bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] text-white placeholder:text-[#8888aa]" />
                        </div>
                        <div className="col-span-1 flex items-center justify-center pt-4">
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400" onClick={() => removeField(i)}>
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button onClick={handleSave} className="w-full bg-[#00f0ff] text-[#07070d] hover:bg-[#00d4e0] font-semibold" disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  {saving ? 'Guardando...' : editingId ? 'Actualizar Servicio' : 'Crear Servicio'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Services Table */}
        <Card className="bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[rgba(0,240,255,0.12)] hover:bg-transparent">
                    <TableHead className="text-[#8888aa]">Servicio</TableHead>
                    <TableHead className="text-[#8888aa]">Categoría</TableHead>
                    <TableHead className="text-[#8888aa]">Precio</TableHead>
                    <TableHead className="text-[#8888aa]">Tiempo</TableHead>
                    <TableHead className="text-[#8888aa]">Estado</TableHead>
                    <TableHead className="text-right text-[#8888aa]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map(service => (
                    <TableRow key={service.id} className="border-[rgba(0,240,255,0.12)] hover:bg-[#13131f]">
                      <TableCell className="font-medium text-white">{service.name}</TableCell>
                      <TableCell><Badge variant="secondary" className="bg-[rgba(0,240,255,0.1)] text-[#00f0ff]">{service.category?.name || service.categorySlug}</Badge></TableCell>
                      <TableCell className="font-semibold text-[#00f0ff]">${service.price}</TableCell>
                      <TableCell className="text-sm text-[#8888aa]">{service.deliveryTime}</TableCell>
                      <TableCell>
                        <Switch checked={service.active} onCheckedChange={() => handleToggle(service)} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-[#8888aa] hover:text-[#00f0ff]" onClick={() => openEdit(service)}>
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300" onClick={() => handleDelete(service.id)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
