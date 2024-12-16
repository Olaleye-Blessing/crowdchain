import { formatNumber } from "./format-number";

export const formatUsd = (amount: number) =>
  formatNumber(amount, {
    locales: "en-US",
    options: { style: "currency", currency: "USD" },
  });
