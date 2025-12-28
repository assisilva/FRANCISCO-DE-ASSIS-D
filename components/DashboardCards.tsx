
import React from 'react';
import { TrendingUp, DollarSign, Users, Clock } from 'lucide-react';
import { DashboardStats } from '../types';
import { formatCurrency } from '../utils';

interface Props {
  stats: DashboardStats;
}

export const DashboardCards: React.FC<Props> = ({ stats }) => {
  const cards = [
    {
      title: 'Faturamento Total',
      value: formatCurrency(stats.totalSalesValue),
      icon: <DollarSign className="w-6 h-6 text-indigo-400" />,
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/20'
    },
    {
      title: 'Lucro Líquido',
      value: formatCurrency(stats.totalProfit),
      icon: <TrendingUp className="w-6 h-6 text-emerald-400" />,
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20'
    },
    {
      title: 'Total de Clientes',
      value: stats.salesCount.toString(),
      icon: <Users className="w-6 h-6 text-blue-400" />,
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      title: 'Vencimentos (5 dias)',
      value: stats.expiringCount.toString(),
      icon: <Clock className="w-6 h-6 text-amber-400" />,
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, idx) => (
        <div 
          key={idx} 
          className={`${card.bgColor} ${card.borderColor} border rounded-2xl p-6 transition-all hover:scale-[1.02] duration-300`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-slate-900 rounded-xl shadow-inner border border-slate-800">
              {card.icon}
            </div>
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{card.title}</p>
          <h3 className="text-2xl font-bold text-slate-100">{card.value}</h3>
        </div>
      ))}
    </div>
  );
};
