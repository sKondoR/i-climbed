export function removeLastUrlSegment(text: string | null) {
  return text?.replace(/\/[^/]+\/?$/, '');
}