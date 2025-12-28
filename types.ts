
export interface Sale {
  id: string;
  clientName: string;
  username: string;
  password?: string;
  purchaseDate: string;
  expiryDate: string;
  value: number;
  cost: number;
}

export interface DashboardStats {
  totalSalesValue: number;
  totalProfit: number;
  salesCount: number;
  expiringCount: number;
}
