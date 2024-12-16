export type INumberFormatter = {
  // locales?: Intl.LocalesArgument;
  locales?: string | string[];
  options?: Intl.NumberFormatOptions;
};

export const formatNumber = (value: number, formatter?: INumberFormatter) => {
  return new Intl.NumberFormat(
    formatter?.locales ?? "en-US",
    formatter?.options,
  ).format(value);
};
