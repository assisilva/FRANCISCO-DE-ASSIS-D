
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  clientName: string;
}

export const DeleteModal: React.FC<Props> = ({ isOpen, onClose, onConfirm, clientName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-800 animate-in zoom-in duration-200">
        <div className="p-6 text-center">
          <div className="mx-auto w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mb-4 border border-rose-500/20">
            <AlertTriangle className="w-8 h-8 text-rose-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-100 mb-2">Excluir Cliente?</h3>
          <p className="text-slate-500 text-sm mb-6 px-2">
            Tem certeza que deseja remover <span className="font-semibold text-slate-300">"{clientName}"</span>? Todos os dados de faturamento acumulados serão perdidos.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition-colors border border-slate-700"
            >
              Manter
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-3 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl shadow-lg shadow-rose-600/20 transition-colors"
            >
              Remover
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
