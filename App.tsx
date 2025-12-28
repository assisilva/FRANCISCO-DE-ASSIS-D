
import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Search, RefreshCw, Copy, MoreVertical, Edit2, Trash2, Eye, EyeOff, RotateCcw, CheckCircle2 } from 'lucide-react';
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
  getProgressBarColor
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
  const [syncingIds, setSyncingIds] = useState<Set<string>>(new Set());
  const [syncedIds, setSyncedIds] = useState<Set<string>>(new Set());
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    localStorage.setItem('iptv_sales', JSON.stringify(sales));
  }, [sales]);

  const stats = useMemo((): DashboardStats => {
    return sales.reduce((acc, sale) => {
      const days = getDaysRemaining(sale.expiryDate);
      return {
        totalSalesValue: acc.totalSalesValue + sale.value,
        totalProfit: acc.totalProfit + (sale.value - sale.cost),
        salesCount: acc.salesCount + 1,
        expiringCount: acc.expiringCount + (days >= 0 && days <= 5 ? 1 : 0)
      };
    }, { totalSalesValue: 0, totalProfit: 0, salesCount: 0, expiringCount: 0 });
  }, [sales, lastUpdate]);

  const filteredSales = useMemo(() => {
    return sales.filter(s => 
      s.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.username.toLowerCase().includes(searchTerm.toLowerCase())
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
        const baseDate = currentExpiry.getTime() > now.getTime() 
          ? s.expiryDate 
          : now.toISOString();
        
        const incrementValue = (s as any).baseValue || s.value;
        const incrementCost = (s as any).baseCost || s.cost;

        return {
          ...s,
          purchaseDate: baseDate,
          value: s.value + incrementValue,
          cost: s.cost + incrementCost,
          expiryDate: calculateExpiry(baseDate),
          renewalCount: ((s as any).renewalCount || 0) + 1,
          baseValue: incrementValue,
          baseCost: incrementCost
        } as Sale;
      }
      return s;
    }));
    setLastUpdate(Date.now());
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleSyncClient = (id: string) => {
    setSyncingIds(prev => new Set(prev).add(id));
    setTimeout(() => {
      setSyncingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setSyncedIds(prev => new Set(prev).add(id));
      setTimeout(() => {
        setSyncedIds(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }, 2000);
    }, 1200);
  };

  const confirmDelete = () => {
    if (saleToDelete) {
      setSales(prev => prev.filter(s => s.id !== saleToDelete.id));
      setSaleToDelete(null);
      setLastUpdate(Date.now());
    }
  };

  const togglePassword = (id: string) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setLastUpdate(Date.now());
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 font-sans selection:bg-indigo-500/30">
      <header className="bg-slate-900/80 border-b border-slate-800 sticky top-0 z-40 px-4 py-4 md:px-8 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
              <RefreshCw className={`w-6 h-6 text-white ${refreshing ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">IPTV Flow</h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Painel de Controle</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all font-medium active:scale-95 border border-slate-700"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Sincronizar
            </button>
            <button 
              onClick={() => {
                setEditingSale(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/20 transition-all font-semibold active:scale-95"
            >
              <Plus className="w-5 h-5" />
              Nova Venda
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-8">
        <DashboardCards stats={stats} />

        <div className="bg-slate-900 p-4 rounded-2xl shadow-xl border border-slate-800 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Pesquisar por cliente ou usuário..."
              className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-200 placeholder:text-slate-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/50 border-b border-slate-800">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Acesso</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Início Ciclo</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Vencimento</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Valor Total</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Lucro Acum.</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredSales.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500 italic">
                      Nenhum registro encontrado. Comece criando uma nova venda!
                    </td>
                  </tr>
                ) : (
                  filteredSales.map((sale) => {
                    const days = getDaysRemaining(sale.expiryDate);
                    const isSyncing = syncingIds.has(sale.id);
                    const isSynced = syncedIds.has(sale.id);
                    const renewalCount = (sale as any).renewalCount || 0;
                    const progress = getSubscriptionProgress(sale.purchaseDate, sale.expiryDate);
                    const progressBarColor = getProgressBarColor(days);
                    
                    // Ajuste visual das cores de status para fundo escuro
                    const statusStyles = days < 0 
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                      : days <= 5 
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

                    return (
                      <tr key={sale.id} className="hover:bg-slate-800/40 transition-colors group/row">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-200">{sale.clientName}</span>
                            <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-slate-500 font-mono uppercase">ID: {sale.id}</span>
                                {renewalCount > 0 && (
                                    <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter border border-indigo-500/20">
                                        {renewalCount}ª Renovação
                                    </span>
                                )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 group/user">
                              <span className="text-sm font-medium text-slate-300 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">{sale.username}</span>
                              <button 
                                onClick={() => copyToClipboard(sale.username)}
                                className="opacity-0 group-hover/user:opacity-100 transition-opacity p-1 text-slate-500 hover:text-indigo-400"
                                title="Copiar Usuário"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="flex items-center gap-2 group/pass">
                              <span className="text-xs font-mono text-slate-500">
                                {visiblePasswords[sale.id] ? sale.password : '••••••••'}
                              </span>
                              <button onClick={() => togglePassword(sale.id)} className="p-1 text-slate-500 hover:text-indigo-400">
                                {visiblePasswords[sale.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-400">
                          {formatDate(sale.purchaseDate)}
                        </td>
                        <td className="px-6 py-4 min-w-[140px]">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-200 font-bold">{formatDate(sale.expiryDate)}</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-tighter shadow-sm ${statusStyles}`}>
                                    {days < 0 ? 'Expirado' : `${days} dias`}
                                </span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                                <div 
                                    className={`h-full transition-all duration-500 ${progressBarColor}`}
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-semibold text-slate-200">{formatCurrency(sale.value)}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-semibold text-emerald-400">+{formatCurrency(sale.value - sale.cost)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-1 opacity-100 md:opacity-0 group-hover/row:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleSyncClient(sale.id)}
                              disabled={isSyncing}
                              className={`p-2 rounded-lg transition-all ${isSynced ? 'text-emerald-400 bg-emerald-400/10' : 'text-slate-500 hover:bg-slate-800 hover:text-indigo-400'}`}
                              title="Sincronizar"
                            >
                              {isSynced ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : (
                                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                              )}
                            </button>
                            <button 
                              onClick={() => handleRenew(sale.id)}
                              className="p-2 text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-all"
                              title="Renovar (+30 dias)"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => {
                                setEditingSale(sale);
                                setIsModalOpen(true);
                              }}
                              className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all"
                              title="Editar"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => setSaleToDelete(sale)}
                              className="p-2 text-rose-400 hover:bg-rose-400/10 rounded-lg transition-all"
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

      <div className="fixed bottom-6 right-6 md:hidden">
        <button 
          onClick={() => {
            setEditingSale(null);
            setIsModalOpen(true);
          }}
          className="w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-2xl active:scale-90 transition-transform shadow-indigo-600/40"
        >
          <Plus className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

export default App;
