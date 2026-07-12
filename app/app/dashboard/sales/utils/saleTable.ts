import type { FlatItem, SaleItemWithProduct } from '../types/saleTable';
import type { SaleType } from '@/types/sale';
import type { SortColumn, SortOrder } from '@/types/others';
import type { AggregatedProduct } from '@/types/product';

export function formatDate(dateStr: Date | string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function getVanColor(van: string): string {
  const colors: Record<string, string> = {
    '1': 'from-blue-500 to-blue-600',
    '2': 'from-emerald-500 to-emerald-600',
    '3': 'from-amber-500 to-amber-600',
    '4': 'from-rose-500 to-rose-600',
  };
  return colors[van] || 'from-slate-500 to-slate-600';
}

export function flattenSales(sales: SaleType[]): FlatItem[] {
  const items: FlatItem[] = [];
  sales.forEach((sale) => {
    if (sale.items && sale.items.length > 0) {
      sale.items.forEach((item: SaleItemWithProduct) => {
        const productObj = item.productId as { name?: string; sku?: string; supplier?: { name?: string } };
        const isPopulated = typeof productObj === 'object' && productObj !== null;
        const productName = isPopulated ? productObj?.name || item.name || 'Unknown' : 'Unknown';
        const sku = isPopulated ? productObj?.sku || '-' : '-';
        const supplierName = item.supplier || (isPopulated ? productObj?.supplier?.name || '-' : '-');
        const price = item.sellingPrice || item.costPrice || 0;

        const type = (sale.type?.toString() || 'SALE') as string;
        const openingQty = (type === 'OPENING') ? item.quantity : 0;
        const returnQty = (type === 'RETURN') ? item.quantity : 0;
        const damageQty = (type === 'DAMAGE') ? item.quantity : 0;
        const totalPrice = (type !== 'DAMAGE' && type !== 'RETURN') ? item.quantity * price : 0;

        items.push({
          saleId: sale._id || '',
          saleType: type,
          note: sale.note || '',
          sku,
          supplierName,
          productName,
          price,
          openingQty,
          returnQty,
          damageQty,
          totalPrice,
        });
      });
    }
  });
  return items;
}

export function sortFlatItems(items: FlatItem[], sortBy: SortColumn, sortOrder: SortOrder): FlatItem[] {
  return [...items].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'productName':
        comparison = a.productName.localeCompare(b.productName);
        break;
      case 'supplierName':
        comparison = a.supplierName.localeCompare(b.supplierName);
        break;
      case 'quantity':
        comparison = a.openingQty - b.openingQty;
        break;
      case 'totalPrice':
        comparison = a.totalPrice - b.totalPrice;
        break;
      case 'totalReturn':
        comparison = a.returnQty - b.returnQty;
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });
}

export const aggregateSalesProducts = (sales: SaleType[]): AggregatedProduct[] => {
    if (!sales || sales.length === 0) return [];

    const flatItems = flattenSales(sales);
    const map: Record<string, AggregatedProduct> = {};

    flatItems.forEach((item) => {
      const key = item.sku || item.productName;
      if (!map[key]) {
        map[key] = {
          sku: item.sku,
          supplierName: item.supplierName,
          productName: item.productName,
          price: item.price,
          openingQty: 0,
          returnQty: 0,
          damageQty: 0,
          totalPrice: 0,
        };
      }
      map[key].openingQty += item.openingQty;
      map[key].returnQty += item.returnQty;
      map[key].damageQty += item.damageQty;
      map[key].totalPrice += item.totalPrice;
    });
    return Object.values(map).sort((a, b) => a.productName.localeCompare(b.productName));
  };