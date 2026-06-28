const toNumber = (value) => {
  const n = Number(value || 0);
  return Number.isFinite(n) ? n : 0;
};

const cache = new Map();

let globalCurrency = 'INR';

export const setGlobalCurrency = (currencyCode) => {
  if (currencyCode) {
    globalCurrency = currencyCode.toUpperCase();
  }
};

const getFormatter = (currencyCode, maximumFractionDigits) => {
  const key = `${currencyCode}-${maximumFractionDigits}`;
  if (cache.has(key)) return cache.get(key);
  
  // Decide the locale based on currency to make it look native. Default to en-US.
  let locale = 'en-US';
  if (currencyCode === 'INR') locale = 'en-IN';
  else if (currencyCode === 'EUR') locale = 'en-IE'; // or 'de-DE' etc
  else if (currencyCode === 'GBP') locale = 'en-GB';

  const fmt = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits,
  });
  cache.set(key, fmt);
  return fmt;
};

export const formatMoney = (value, { maximumFractionDigits = 2 } = {}) =>
  getFormatter(globalCurrency, maximumFractionDigits).format(toNumber(value));
