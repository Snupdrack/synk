'use client';

import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Search, Clock, FileText, CreditCard, Building, Heart, Shield, Plane, Receipt, FileCheck } from 'lucide-react';

const iconMap: Record<string, any> = {
  FileText, CreditCard, Building, Heart, Shield, Plane: FileText, Receipt: FileText, FileCheck: FileText,
};

export function ServicesView() {
  const { services, setView, setSelectedService, user } = useStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('Todos');

  const categories = ['Todos', ...Array.from(new Set(services.map(s => s.category?.name || s.categorySlug)))];

  const filtered = services.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase());
    const catName = s.category?.name || s.categorySlug;
    const matchCategory = category === 'Todos' || catName === category;
    return matchSearch && matchCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white mb-2">Nuestros Servicios</h1>
        <p className="text-[#8888aa] mb-8">Encuentra el trámite que necesitas y solicítalo en minutos</p>

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8888aa]" />
            <Input placeholder="Buscar servicios..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-[#0f0f1a] border-[rgba(0,240,255,0.12)] text-white placeholder:text-[#8888aa]" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <Button key={cat} variant={category === cat ? 'default' : 'outline'} size="sm" onClick={() => setCategory(cat)}
                className={category === cat ? 'bg-[#00f0ff] text-[#07070d] hover:bg-[#00d4e0]' : 'border-[rgba(0,240,255,0.12)] text-[#8888aa] hover:text-[#00f0ff] hover:border-[#00f0ff]'}>
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((service, i) => {
            const IconComp = iconMap[service.icon] || FileText;
            return (
              <motion.div key={service.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer bg-[#13131f] border-[rgba(0,240,255,0.12)] shadow-sm h-full"
                  onClick={() => {
                    if (!user) { setView('login'); return; }
                    setSelectedService(service.id);
                    setView('order');
                  }}>
                  <CardContent className="pt-6 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-[rgba(0,240,255,0.1)] rounded-xl flex items-center justify-center">
                        <IconComp className="w-6 h-6 text-[#00f0ff]" />
                      </div>
                      <Badge variant="secondary" className="bg-[rgba(0,240,255,0.1)] text-[#00f0ff]">{service.category?.name || service.categorySlug}</Badge>
                    </div>
                    <h3 className="font-semibold text-white mb-1">{service.name}</h3>
                    <p className="text-sm text-[#8888aa] mb-4 flex-1 line-clamp-3">{service.description}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-[rgba(0,240,255,0.12)]">
                      <span className="text-xl font-bold text-[#00f0ff]">${service.price} MXN</span>
                      <span className="text-xs text-[#8888aa] flex items-center gap-1"><Clock className="w-3 h-3" />{service.deliveryTime}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-[#8888aa]">
            <FileText className="w-12 h-12 mx-auto mb-4" />
            <p>No se encontraron servicios</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
