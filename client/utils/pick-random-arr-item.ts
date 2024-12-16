export const pickRandomArrItem = <T>(array: Array<T>) => {
  const length = array.length;

  // Generate a random index between 0 (inclusive) and length (exclusive)
  const randomIndex = Math.floor(Math.random() * length);

  return array[randomIndex];
};
