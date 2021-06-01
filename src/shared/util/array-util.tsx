export const swapPositions = (array, idx, offset) => {
  const targetIdx = idx + offset;
  if (targetIdx >= 0 && targetIdx < array.length) {
    [array[idx], array[targetIdx]] = [array[targetIdx], array[idx]];
  }
  return array;
};
