import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function getMarketplaceColor(marketplaceName?: string) {
  const name = marketplaceName?.toLowerCase() || '';
  if (name.includes('shopee')) return 'bg-shopee text-white';
  if (name.includes('temu')) return 'bg-temu text-white';
  if (name.includes('amazon')) return 'bg-amazon text-black';
  if (name.includes('mercado')) return 'bg-mercadolivre text-mercadolivre-blue';
  return 'bg-gray-800 text-white';
}

export function getMarketplaceBorderColor(marketplaceName?: string) {
  const name = marketplaceName?.toLowerCase() || '';
  if (name.includes('shopee')) return 'border-shopee/50';
  if (name.includes('temu')) return 'border-temu/50';
  if (name.includes('amazon')) return 'border-amazon/50';
  if (name.includes('mercado')) return 'border-mercadolivre/50';
  return 'border-gray-200';
}
