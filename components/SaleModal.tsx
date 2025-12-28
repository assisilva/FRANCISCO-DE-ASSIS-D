
import React, { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
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
    purchaseDate: new Date().toISOString().split('T')[0],
    value: 30,
    cost: 10
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
        purchaseDate: today,
        value: 30,
        cost: 10
      });
      setPreviewExpiry(calculateExpiry(today));
    }
  }, [editSale, isOpen]);

  useEffect(() => {
    if (formData.purchaseDate) {
      setPreviewExpiry(calculateExpiry(formData.purchaseDate));
    }
  }, [formData.purchaseDate]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const purchaseDateStr = formData.purchaseDate || new Date().toISOString();
    
    const newSale: Sale = {
      id: editSale?.id || generateId(),
      clientName: formData.clientName || '',
      username: formData.username || '',
      password: formData.password || '',
      purchaseDate: purchaseDateStr,
      expiryDate: previewExpiry,
      value: Number(formData.value) || 0,
      cost: Number(formData.cost) || 0,
    };
    onSave(newSale);
    onClose();
  };

  const inputClass = "w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-100 placeholder:text-slate-600";
  const labelClass = "block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-800 animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h3 className="text-lg font-bold text-slate-100">
            {editSale ? 'Editar Registro' : 'Lançar Nova Venda'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={labelClass}>Nome do Cliente</label>
              <input
                required
                type="text"
                className={inputClass}
                value={formData.clientName}
                onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                placeholder="Ex: Carlos Oliveira"
              />
            </div>
            <div>
              <label className={labelClass}>Usuário / Login</label>
              <input
                required
                type="text"
                className={inputClass}
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
                placeholder="Ex: premium_01"
              />
            </div>
            <div>
              <label className={labelClass}>Senha</label>
              <input
                type="text"
                className={inputClass}
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                placeholder="Ex: 123456"
              />
            </div>
            <div className="col-span-2 bg-indigo-500/5 p-4 rounded-2xl border border-indigo-500/10">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-5 h-5 text-indigo-400" />
                <span className="text-sm font-bold text-indigo-100 uppercase tracking-tight">Período de 30 Dias</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-indigo-400/60 uppercase mb-1">Início do Ciclo</label>
                  <input
                    required
                    type="date"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-slate-200"
                    value={formData.purchaseDate}
                    onChange={e => setFormData({ ...formData, purchaseDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-indigo-400/60 uppercase mb-1">Data de Expiração</label>
                  <div className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm font-semibold text-indigo-400">
                    {previewExpiry ? formatDate(previewExpiry) : '--/--/----'}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label className={labelClass}>Preço Venda (R$)</label>
              <input
                required
                type="number"
                step="0.01"
                className={inputClass}
                value={formData.value}
                onChange={e => setFormData({ ...formData, value: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className={labelClass}>Custo (R$)</label>
              <input
                required
                type="number"
                step="0.01"
                className={inputClass}
                value={formData.cost}
                onChange={e => setFormData({ ...formData, cost: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition-colors border border-slate-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/20 transition-colors"
            >
              Confirmar Registro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
