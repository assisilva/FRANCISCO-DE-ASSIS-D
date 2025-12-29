
import React, { useState, useEffect } from 'react';
import { X, Calendar, MessageCircle, Server, CreditCard } from 'lucide-react';
import { Sale } from '../types';
import { generateId, calculateExpiry, formatDate } from '../utils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sale: Sale) => void;
  editSale?: Sale | null;
}

export const SaleModal: React.FC<Props> = ({ isOpen, onClose, onSave, editSale }) => {
  const [formData, setFormData] = useState<Partial<Sale>>({
    clientName: '',
    username: '',
    password: '',
    whatsapp: '',
    server: 'SERVIDOR 01',
    plan: 'Mensal',
    purchaseDate: new Date().toISOString().split('T')[0],
    value: 35,
    cost: 10,
    status: 'Ativo'
  });

  const [previewExpiry, setPreviewExpiry] = useState('');

  useEffect(() => {
    if (editSale) {
      setFormData(editSale);
      setPreviewExpiry(editSale.expiryDate);
    } else {
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        clientName: '',
        username: '',
        password: '',
        whatsapp: '',
        server: 'SERVIDOR 01',
        plan: 'Mensal',
        purchaseDate: today,
        value: 35,
        cost: 10,
        status: 'Ativo'
      });
      setPreviewExpiry(calculateExpiry(today, 'Mensal'));
    }
  }, [editSale, isOpen]);

  useEffect(() => {
    if (formData.purchaseDate && formData.plan) {
      setPreviewExpiry(calculateExpiry(formData.purchaseDate, formData.plan));
    }
  }, [formData.purchaseDate, formData.plan]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const purchaseDateStr = formData.purchaseDate || new Date().toISOString();
    
    const newSale: Sale = {
      id: editSale?.id || generateId(),
      clientName: formData.clientName || '',
      username: formData.username || '',
      password: formData.password || '',
      whatsapp: formData.whatsapp || '',
      server: formData.server || 'SERVIDOR 01',
      plan: formData.plan || 'Mensal',
      purchaseDate: purchaseDateStr,
      expiryDate: previewExpiry,
      value: Number(formData.value) || 0,
      cost: Number(formData.cost) || 0,
      status: formData.status || 'Ativo',
      renewalCount: editSale?.renewalCount || 0,
      baseValue: editSale?.baseValue || Number(formData.value),
      baseCost: editSale?.baseCost || Number(formData.cost),
    };
    onSave(newSale);
    onClose();
  };

  const inputClass = "w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-100 placeholder:text-slate-600 text-sm";
  const labelClass = "block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-800 animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-widest">
            {editSale ? 'EDITAR CADASTRO' : 'NOVO CLIENTE'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={labelClass}>NOME COMPLETO</label>
              <input required type="text" className={inputClass} value={formData.clientName} onChange={e => setFormData({ ...formData, clientName: e.target.value })} />
            </div>
            
            <div>
              <label className={labelClass}>WHATSAPP (COM DDD)</label>
              <div className="relative">
                <input required type="text" placeholder="(00) 00000-0000" className={inputClass} value={formData.whatsapp} onChange={e => setFormData({ ...formData, whatsapp: e.target.value })} />
                <MessageCircle className="absolute right-3 top-2.5 w-4 h-4 text-slate-600" />
              </div>
            </div>

            <div>
                <label className={labelClass}>SERVIDOR</label>
                <div className="relative">
                    <select className={inputClass} value={formData.server} onChange={e => setFormData({ ...formData, server: e.target.value })}>
                        <option>SERVIDOR 01</option>
                        <option>SERVIDOR 02</option>
                        <option>SERVIDOR 03</option>
                        <option>P2P TURBO</option>
                    </select>
                    <Server className="absolute right-3 top-2.5 w-4 h-4 text-slate-600 pointer-events-none" />
                </div>
            </div>

            <div>
              <label className={labelClass}>LOGIN</label>
              <input required type="text" className={inputClass} value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} />
            </div>

            <div>
              <label className={labelClass}>SENHA</label>
              <input type="text" className={inputClass} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
            </div>

            <div>
                <label className={labelClass}>PLANO</label>
                <select className={inputClass} value={formData.plan} onChange={e => setFormData({ ...formData, plan: e.target.value as any })}>
                    <option>Mensal</option>
                    <option>Bimestral</option>
                    <option>Trimestral</option>
                    <option>Semestral</option>
                    <option>Anual</option>
                </select>
            </div>

            <div>
                <label className={labelClass}>SITUAÇÃO</label>
                <select className={inputClass} value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as any })}>
                    <option>Ativo</option>
                    <option>Inativo</option>
                </select>
            </div>

            <div className="col-span-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>DATA ATIVAÇÃO</label>
                        <input required type="date" className={inputClass} value={formData.purchaseDate} onChange={e => setFormData({ ...formData, purchaseDate: e.target.value })} />
                    </div>
                    <div>
                        <label className={labelClass}>VENCIMENTO ESTIMADO</label>
                        <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm font-bold text-indigo-400">
                            {previewExpiry ? formatDate(previewExpiry) : '--/--/----'}
                        </div>
                    </div>
                </div>
            </div>

            <div>
              <label className={labelClass}>VALOR VENDA (R$)</label>
              <input required type="number" step="0.01" className={inputClass} value={formData.value} onChange={e => setFormData({ ...formData, value: Number(e.target.value) })} />
            </div>

            <div>
              <label className={labelClass}>CUSTO PAINEL (R$)</label>
              <input required type="number" step="0.01" className={inputClass} value={formData.cost} onChange={e => setFormData({ ...formData, cost: Number(e.target.value) })} />
            </div>
          </div>

          <div className="pt-6 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all uppercase text-xs tracking-widest">Cancelar</button>
            <button type="submit" className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg transition-all uppercase text-xs tracking-widest">Salvar Cadastro</button>
          </div>
        </form>
      </div>
    </div>
  );
};
