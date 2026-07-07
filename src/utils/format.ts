export function formatNumber(num: number): string {
  return num.toLocaleString('zh-CN');
}

export function formatCurrency(num: number): string {
  return `¥${num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatPercent(num: number): string {
  return `${(num * 100).toFixed(2)}%`;
}
