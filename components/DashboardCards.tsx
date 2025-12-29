
import React from 'react';
import { CheckCircle, AlertCircle, BarChart3, Users, Zap, UserPlus, Power } from 'lucide-react';
import { DashboardStats } from '../types';
import { formatCurrency } from '../utils';

interface Props {
  stats: DashboardStats;
}

export const DashboardCards: React.FC<Props> = ({ stats }) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 mb-8">
      {/* Main Stats Group */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* EM DIA */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">EM DIA | <span className="text-emerald-400">{stats.emDiaCount}</span></p>
              <h3 className="text-2xl font-bold text-emerald-400 mt-1">{formatCurrency(stats.emDiaValue)}</h3>
            </div>
            <div className="bg-emerald-500/20 p-2 rounded-full border border-emerald-500/20">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div className="h-1 w-full bg-slate-800 rounded-full mt-4">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(stats.emDiaCount / Math.max(1, stats.salesCount)) * 100}%` }}></div>
          </div>
        </div>

        {/* VENCIDOS */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">VENCIDOS | <span className="text-rose-400">{stats.vencidosCount}</span></p>
              <h3 className="text-2xl font-bold text-rose-400 mt-1">{formatCurrency(stats.vencidosValue)}</h3>
            </div>
            <div className="bg-rose-500/20 p-2 rounded-full border border-rose-500/20">
              <AlertCircle className="w-5 h-5 text-rose-400" />
            </div>
          </div>
          <div className="h-1 w-full bg-slate-800 rounded-full mt-4">
            <div className="h-full bg-rose-500 rounded-full" style={{ width: `${(stats.vencidosCount / Math.max(1, stats.salesCount)) * 100}%` }}></div>
          </div>
        </div>

        {/* TOTAL */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">TOTAL | <span className="text-slate-300">{stats.salesCount}</span></p>
              <h3 className="text-2xl font-bold text-slate-100 mt-1">{formatCurrency(stats.totalSalesValue)}</h3>
            </div>
            <div className="bg-slate-700/50 p-2 rounded-full border border-slate-700">
              <BarChart3 className="w-5 h-5 text-slate-300" />
            </div>
          </div>
          <div className="h-1 w-full bg-slate-800 rounded-full mt-4">
            <div className="h-full bg-slate-400 rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>
      </div>

      {/* Side Mini Stats */}
      <div className="w-full lg:w-72 grid grid-cols-2 gap-3">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
            <span className="text-[9px] font-bold text-slate-500 uppercase">Novos</span>
            <div className="flex items-end justify-between">
                <span className="text-lg font-bold text-slate-200">{stats.novosCount}</span>
                <UserPlus className="w-4 h-4 text-indigo-400 mb-1" />
            </div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
            <span className="text-[9px] font-bold text-slate-500 uppercase">Ativos</span>
            <div className="flex items-end justify-between">
                <span className="text-lg font-bold text-emerald-400">{stats.ativosCount}</span>
                <Zap className="w-4 h-4 text-emerald-400 mb-1" />
            </div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
            <span className="text-[9px] font-bold text-slate-500 uppercase">Inativos</span>
            <div className="flex items-end justify-between">
                <span className="text-lg font-bold text-rose-400">{stats.inativosCount}</span>
                <Power className="w-4 h-4 text-rose-400 mb-1" />
            </div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
            <span className="text-[9px] font-bold text-slate-500 uppercase">Lucro</span>
            <div className="flex items-end justify-between">
                <span className="text-lg font-bold text-emerald-400">{formatCurrency(stats.totalProfit)}</span>
                <span className="text-[8px] text-emerald-500 font-bold mb-1">↑</span>
            </div>
        </div>
      </div>
    </div>
  );
};
