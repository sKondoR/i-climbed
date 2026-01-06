export function removeLastUrlSegment(text?: string) {
  return text?.replace(/\/[^/]+\/?$/, '');
}