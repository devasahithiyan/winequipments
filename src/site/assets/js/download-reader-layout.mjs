/** Keep the page indicator useful even when several short pages fit on screen. */
export function mostVisiblePage(rectangles, viewport, fallback = 1) {
  let result = fallback, largest = 0;
  rectangles.forEach((rect, index) => {
    const overlap = Math.max(0, Math.min(rect.bottom, viewport.bottom) - Math.max(rect.top, viewport.top));
    if (overlap > largest) { largest = overlap; result = index + 1; }
  });
  return result;
}
