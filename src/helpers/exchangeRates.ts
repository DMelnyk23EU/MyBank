import { Currency } from "@/customTypes/Currency";

const exchangeRates: Record<Currency, Record<Currency, number>> = {
  usd: { usd: 1, eur: 0.92, gbp: 0.78 },
  eur: { usd: 1.09, eur: 1, gbp: 0.85 },
  gbp: { usd: 1.28, eur: 1.17, gbp: 1 }
};

export function convertCurrency(
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency
): number {
  if (fromCurrency === toCurrency) {
    return amount; // No conversion needed
  }

  const rate = exchangeRates[fromCurrency][toCurrency];
  return parseFloat((amount * rate).toFixed(2)); // Rounded to 2 decimal places
}
