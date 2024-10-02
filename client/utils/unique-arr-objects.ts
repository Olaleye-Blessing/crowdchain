type ArrayOfUniqueObjects = <T extends { [key: string]: any }>(
  arr: T[],
  key: keyof T,
  track?: Set<T>,
) => T[];

export const arrayOfUniqueObjs: ArrayOfUniqueObjects = (
  arr,
  key,
  track = new Set(),
) =>
  arr.filter((item) => (track.has(item[key]) ? false : track.add(item[key])));
