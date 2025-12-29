
import { format, differenceInDays, addDays, parseISO } from 'date-fns';
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
  if (days < 0) return 'text-rose-400 border-rose-500/20 bg-rose-500/10';
  if (days <= 5) return 'text-amber-400 border-amber-500/20 bg-amber-500/10';
  return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10';
};

export const getProgressBarColor = (days: number) => {
  if (days < 0) return 'bg-rose-500';
  if (days <= 5) return 'bg-amber-500';
  return 'bg-emerald-500';
};

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const calculateExpiry = (purchaseDate: string, plan: string = 'Mensal') => {
  const date = parseISO(purchaseDate);
  let days = 30;
  if (plan === 'Bimestral') days = 60;
  if (plan === 'Trimestral') days = 90;
  if (plan === 'Semestral') days = 180;
  if (plan === 'Anual') days = 365;
  
  return format(addDays(date, days), "yyyy-MM-dd'T'HH:mm:ss");
};

export const getWhatsAppNotificationLink = (sale: any) => {
  const days = getDaysRemaining(sale.expiryDate);
  const phone = sale.whatsapp.replace(/\D/g, '');
  
  let message = '';
  if (days < 0) {
    message = `Olá ${sale.clientName}! 🚨 Notamos que seu acesso IPTV (Login: ${sale.username}) venceu há ${Math.abs(days)} dias. Gostaria de renovar para não perder sua programação favorita?`;
  } else if (days === 0) {
    message = `Olá ${sale.clientName}! ⚡ Seu acesso IPTV vence HOJE. Vamos renovar agora para evitar interrupções?`;
  } else {
    message = `Olá ${sale.clientName}! 👋 Passando para avisar que seu acesso IPTV vence em ${days} dias (${formatDate(sale.expiryDate)}). Podemos agendar sua renovação?`;
  }

  return `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`;
};
