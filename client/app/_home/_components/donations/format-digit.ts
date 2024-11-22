export const formatDigit = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "decimal" }).format(value);
