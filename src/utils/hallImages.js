export const HALL_IMAGES = [
  '/images/hall-1.webp',
  '/images/hall-2.jpg',
  '/images/hall-3.png',
  '/images/hall-4.jpg',
];

export function getHallImage(zalId, zallar) {
  const index = zallar.findIndex((z) => z.id === zalId);
  return HALL_IMAGES[(index >= 0 ? index : 0) % HALL_IMAGES.length];
}
