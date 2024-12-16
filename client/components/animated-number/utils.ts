import {
  formatNumber as _formatNumber,
  INumberFormatter,
} from "@/utils/format-number";

// https://stackoverflow.com/a/17369245
const countDecimals = (value: number) => {
  if (Math.floor(value) === value) return 0;

  let str = value.toString();

  if (str.indexOf(".") !== -1 && str.indexOf("-") !== -1) {
    return +str.split("-")[1] || 0;
  } else if (str.indexOf(".") !== -1) {
    return +str.split(".")[1].length || 0;
  }

  return +str.split("-")[1] || 0;
};

export type IFormatter = INumberFormatter;

export const formatNumber = (
  latest: number,
  original: number,
  formatter?: IFormatter,
) => {
  let value = +latest.toFixed(countDecimals(original));

  return _formatNumber(value, formatter);
};
