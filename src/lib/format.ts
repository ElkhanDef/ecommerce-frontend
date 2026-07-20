const priceFormatter = new Intl.NumberFormat("tr-TR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Turkish commerce convention: amount first, then the symbol with a space
 * ("2.300,00 ₺") — Intl's tr-TR currency style glues them ("₺2.300,00").
 */
export function formatPrice(value: number): string {
  return `${priceFormatter.format(value)} ₺`;
}
