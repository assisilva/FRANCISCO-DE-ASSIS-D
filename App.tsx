
import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Search, RefreshCw, Copy, MessageCircle, Edit2, Trash2, Eye, EyeOff, RotateCcw, CheckCircle2, Phone } from 'lucide-react';
// Added missing imports from date-fns
import { differenceInDays, parseISO } from 'date-fns';
import { Sale, DashboardStats } from './types';
import { DashboardCards } from './components/DashboardCards';
import { SaleModal } from './components/SaleModal';
import { DeleteModal } from './components/DeleteModal';
import { 
  formatCurrency, 
  formatDate, 
  getDaysRemaining, 
  getStatusColor, 
  calculateExpiry,
  getSubscriptionProgress,
  getProgressBarColor,
  getWhatsAppNotificationLink
} from './utils';

const App: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('iptv_sales');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [saleToDelete, setSaleToDelete] = useState<Sale | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    localStorage.setItem('iptv_sales', JSON.stringify(sales));
  }, [sales]);

  const stats = useMemo((): DashboardStats => {
    const now = new Date();
    return sales.reduce((acc, sale) => {
      const days = getDaysRemaining(sale.expiryDate);
      const isVencido = days < 0;
      const isAtivo = sale.status === 'Ativo';
      // Use parseISO to ensure the date string is handled correctly with differenceInDays
      const isNew = differenceInDays(now, parseISO(sale.purchaseDate)) <= 7;

      return {
        totalSalesValue: acc.totalSalesValue + sale.value,
        totalProfit: acc.totalProfit + (sale.value - sale.cost),
        salesCount: acc.salesCount + 1,
        expiringCount: acc.expiringCount + (days >= 0 && days <= 5 ? 1 : 0),
        vencidosCount: acc.vencidosCount + (isVencido ? 1 : 0),
        vencidosValue: acc.vencidosValue + (isVencido ? sale.value : 0),
        emDiaCount: acc.emDiaCount + (!isVencido ? 1 : 0),
        emDiaValue: acc.emDiaValue + (!isVencido ? sale.value : 0),
        novosCount: acc.novosCount + (isNew ? 1 : 0),
        ativosCount: acc.ativosCount + (isAtivo ? 1 : 0),
        inativosCount: acc.inativosCount + (!isAtivo ? 1 : 0)
      };
    }, { 
        totalSalesValue: 0, totalProfit: 0, salesCount: 0, expiringCount: 0, 
        vencidosCount: 0, vencidosValue: 0, emDiaCount: 0, emDiaValue: 0,
        novosCount: 0, ativosCount: 0, inativosCount: 0
    });
  }, [sales, lastUpdate]);

  const filteredSales = useMemo(() => {
    return sales.filter(s => 
      s.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.server.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
  }, [sales, searchTerm]);

  const handleSaveSale = (saleData: Sale) => {
    if (editingSale) {
      setSales(prev => prev.map(s => s.id === saleData.id ? saleData : s));
    } else {
      setSales(prev => [...prev, saleData]);
    }
    setLastUpdate(Date.now());
  };

  const handleRenew = (id: string) => {
    setSales(prev => prev.map(s => {
      if (s.id === id) {
        const now = new Date();
        const currentExpiry = new Date(s.expiryDate);
        const baseDate = currentExpiry.getTime() > now.getTime() ? s.expiryDate : now.toISOString();
        
        const incrementValue = s.baseValue || s.value;
        const incrementCost = s.baseCost || s.cost;

        return {
          ...s,
          purchaseDate: baseDate,
          value: s.value + incrementValue,
          cost: s.cost + incrementCost,
          expiryDate: calculateExpiry(baseDate, s.plan),
          renewalCount: (s.renewalCount || 0) + 1,
          status: 'Ativo'
        } as Sale;
      }
      return s;
    }));
    setLastUpdate(Date.now());
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleToggleStatus = (id: string) => {
    setSales(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'Ativo' ? 'Inativo' : 'Ativo' } as Sale : s));
    setLastUpdate(Date.now());
  };

  const confirmDelete = () => {
    if (saleToDelete) {
      setSales(prev => prev.filter(s => s.id !== saleToDelete.id));
      setSaleToDelete(null);
      setLastUpdate(Date.now());
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 font-sans selection:bg-indigo-500/30">
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 px-4 py-3 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <RefreshCw className={`w-6 h-6 text-white ${refreshing ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tighter uppercase italic leading-none">IPTV Flow <span className="text-indigo-500">PRO</span></h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Sistema de Gestão Master</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-3.5 h-3.5" />
                <input 
                    type="text" 
                    placeholder="BUSCAR CLIENTE..."
                    className="pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-[10px] font-bold tracking-widest text-slate-200 placeholder:text-slate-600 w-48 lg:w-64 uppercase"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <button 
              onClick={() => {
                setEditingSale(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg transition-all font-bold uppercase text-[10px] tracking-widest active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              Cadastrar
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-6">
        <DashboardCards stats={stats} />

        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/30 border-b border-slate-800">
                  <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">Nome Completo</th>
                  <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">Login</th>
                  <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">Servidor</th>
                  <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">Plano</th>
                  <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest text-right">Valor</th>
                  <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">Vencimento</th>
                  <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">Situação</th>
                  <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">Controle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredSales.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-600 italic text-xs">
                      Nenhum registro encontrado no banco de dados.
                    </td>
                  </tr>
                ) : (
                  filteredSales.map((sale) => {
                    const days = getDaysRemaining(sale.expiryDate);
                    const statusStyles = getStatusColor(days);
                    const progress = getSubscriptionProgress(sale.purchaseDate, sale.expiryDate);
                    const progressBarColor = getProgressBarColor(days);
                    const isVencido = days < 0;

                    return (
                      <tr key={sale.id} className="hover:bg-slate-800/40 transition-colors group/row text-[11px] font-medium">
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span className="text-slate-200 font-bold uppercase">{sale.clientName}</span>
                            <span className="text-[9px] text-slate-600 font-mono tracking-tighter">{sale.id}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                            <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700 font-mono">{sale.username}</span>
                        </td>
                        <td className="px-4 py-3">
                            <span className="text-slate-500 font-bold">{sale.server}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                            <span className="text-indigo-400 font-bold uppercase">{sale.plan}</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-slate-200 font-black">{formatCurrency(sale.value)}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1">
                            <span className={`font-black ${isVencido ? 'text-rose-500' : 'text-slate-300'}`}>{formatDate(sale.expiryDate)}</span>
                            <div className="w-20 h-1 bg-slate-800 rounded-full overflow-hidden">
                                <div className={`h-full ${progressBarColor}`} style={{ width: `${progress}%` }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                            <button 
                                onClick={() => handleToggleStatus(sale.id)}
                                className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border tracking-tighter transition-all ${sale.status === 'Ativo' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'}`}
                            >
                                {sale.status}
                            </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1.5">
                            <a 
                                href={getWhatsAppNotificationLink(sale)} 
                                target="_blank" 
                                rel="noreferrer"
                                className="p-1.5 text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-all border border-transparent hover:border-emerald-400/20"
                                title="Notificar via WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                            <button 
                              onClick={() => handleRenew(sale.id)}
                              className="p-1.5 text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-all border border-transparent hover:border-indigo-400/20"
                              title="Renovar Acesso"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => {
                                setEditingSale(sale);
                                setIsModalOpen(true);
                              }}
                              className="p-1.5 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all border border-transparent hover:border-blue-400/20"
                              title="Editar"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => setSaleToDelete(sale)}
                              className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all border border-transparent hover:border-rose-500/20"
                              title="Excluir"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <SaleModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSale(null);
        }}
        onSave={handleSaveSale}
        editSale={editingSale}
      />

      <DeleteModal
        isOpen={!!saleToDelete}
        onClose={() => setSaleToDelete(null)}
        onConfirm={confirmDelete}
        clientName={saleToDelete?.clientName || ''}
      />
    </div>
  );
};

export default App;
