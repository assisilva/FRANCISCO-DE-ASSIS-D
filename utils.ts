
import { format, differenceInDays, addDays, parseISO, differenceInSeconds } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDate = (dateString: string) => {
  return format(parseISO(dateString), 'dd/MM/yyyy', { locale: ptBR });
};

export const getDaysRemaining = (expiryDate: string) => {
  const diff = differenceInDays(parseISO(expiryDate), new Date());
  return diff;
};

export const getSubscriptionProgress = (purchaseDate: string, expiryDate: string) => {
  const start = parseISO(purchaseDate).getTime();
  const end = parseISO(expiryDate).getTime();
  const now = new Date().getTime();
  
  if (now > end) return 100;
  if (now < start) return 0;
  
  const total = end - start;
  const elapsed = now - start;
  return Math.min(100, Math.max(0, (elapsed / total) * 100));
};

export const getStatusColor = (days: number) => {
  if (days < 0) return 'bg-rose-100 text-rose-700 border-rose-200';
  if (days <= 5) return 'bg-amber-100 text-amber-700 border-amber-200';
  return 'bg-emerald-100 text-emerald-700 border-emerald-200';
};

export const getProgressBarColor = (days: number) => {
  if (days < 0) return 'bg-rose-500';
  if (days <= 5) return 'bg-amber-500';
  return 'bg-emerald-500';
};

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const calculateExpiry = (purchaseDate: string) => {
  const date = parseISO(purchaseDate);
  return format(addDays(date, 30), "yyyy-MM-dd'T'HH:mm:ss");
};
