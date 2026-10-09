export const normalize = text => String(text).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
export function matchesProduct(product, query, family = '', industry = '') {
  if (family && product.family !== family) return false;
  if (industry && !product.industries.includes(industry)) return false;
  const haystack = normalize(product.search), needle = normalize(query);
  return !needle || needle.split(' ').every(term => haystack.includes(term)) || haystack.replaceAll(' ', '').includes(needle.replaceAll(' ', ''));
}
