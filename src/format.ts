/**
 * 数值格式化工具：与 Demo 页保持一致的展示风格（货币 / ROAS / 整数 / 百分比 / 涨跌）。
 * 独立抽出便于看板各页复用，避免重复造轮子；零额外依赖。
 */

/** 货币格式化：默认人民币符号，可传其他符号（如 $ / €）。 */
export function formatCurrency(value: number, symbol = '¥'): string {
  return `${symbol}${Math.round(value).toLocaleString('en-US')}`;
}

/** ROAS 格式化：一位小数 + x。 */
export function formatRoas(value: number): string {
  return `${value.toFixed(1)}x`;
}

/** 整数格式化：千分位。 */
export function formatInt(value: number): string {
  return Math.round(value).toLocaleString('en-US');
}

/** 百分比格式化：一位小数 + %。 */
export function formatPct(value: number): string {
  return `${value.toFixed(1)}%`;
}

/** 带符号百分比：用于涨跌展示。 */
export function formatDelta(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}
