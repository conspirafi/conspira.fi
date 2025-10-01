export function formatPriceToPercentFloor(price: number) {
  // Перетворюємо вхідне значення на число
  const num = parseFloat(price.toString());

  // Якщо число менше 0.01, множимо на 10000 і округляємо до 1 знака
  if (num < 0.01) {
    return (num * 10000).toFixed(1);
  }
  // Для чисел >= 0.01 просто округляємо до 1 знака
  return num.toFixed(1);
}

export function roundToTwoDecimals(num: number): number {
  return Number(num.toFixed(2));
}
