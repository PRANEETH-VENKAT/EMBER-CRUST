/**
 * Returns the local WebP image path for a given menu item slug.
 * @param slug - unique kebab-case slug of the dish
 */
export function getImagePath(slug?: string): string {
  if (!slug) return '';
  return `/images/menu/${slug}.webp`;
}

export default getImagePath;
