/**
 * Convert smallest unit to readable value
 */
export function amountTostring(amount: string, decimals: number): string {

  const str = amount;

  if (str.length <= decimals) {
    return `0.${str.padStart(decimals, '0')}`.replace(/\.?0+$/, "");
  }
  const int = str.slice(0, str.length - decimals);
  const decimal = str.slice(str.length - decimals);

  // concat and remove all trailing zeros
  return `${int}.${decimal}`.replace(/\.?0+$/, "");
}


export function formatNumber(input: string, decimals = 2): string {
  // Convert the string to a number and format it with two decimal places
  const formattedNumber = parseFloat(input).toFixed(decimals);

  // Remove trailing zeros and the decimal point if it's not needed
  return parseFloat(formattedNumber).toString();
}