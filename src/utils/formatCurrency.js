export function formatCurrency(amount) {
  // Convert the number to a string and split it into whole and decimal parts
  const parts = amount.toString().split('.');
  // Add commas to the whole part of the number
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  // Return the formatted currency string with the Australian dollar sign
  return '$' + parts.join('.');
}