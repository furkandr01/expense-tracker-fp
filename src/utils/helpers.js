/**
 * Format a date object into YYYY-MM-DD format for input fields
 * @param {Date} date - Date object to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
};

/**
 * Format a currency amount
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency symbol (default: ₺)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = '₺') => {
  return `${currency} ${amount.toFixed(2)}`;
};

/**
 * Calculate days remaining between two dates
 * @param {Date|string} targetDate - Target date
 * @param {Date|string} currentDate - Current date (default: now)
 * @returns {number} Number of days remaining
 */
export const daysRemaining = (targetDate, currentDate = new Date()) => {
  const target = new Date(targetDate);
  const current = new Date(currentDate);
  
  // Reset time part for accurate day calculation
  target.setHours(0, 0, 0, 0);
  current.setHours(0, 0, 0, 0);
  
  // Calculate difference in milliseconds and convert to days
  const diffTime = Math.abs(target - current);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}; 