
export interface Sale {
  id: string;
  clientName: string;
  username: string;
  password?: string;
  whatsapp: string;
  server: string;
  plan: 'Mensal' | 'Bimestral' | 'Trimestral' | 'Semestral' | 'Anual';
  purchaseDate: string;
  expiryDate: string;
  value: number;
  cost: number;
  status: 'Ativo' | 'Inativo';
  renewalCount?: number;
  baseValue?: number;
  baseCost?: number;
}

export interface DashboardStats {
  totalSalesValue: number;
  totalProfit: number;
  salesCount: number;
  expiringCount: number;
  vencidosCount: number;
  vencidosValue: number;
  emDiaCount: number;
  emDiaValue: number;
  novosCount: number;
  ativosCount: number;
  inativosCount: number;
}
