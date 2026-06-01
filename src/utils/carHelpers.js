export function buildGalleryImages(car) {
  if (!car) return [];

  const rawImages = [
    car.imageUrl,
    ...(Array.isArray(car.galleryImages) ? car.galleryImages : []),
    ...(Array.isArray(car.images) ? car.images : []),
  ];

  const filtered = rawImages.filter((image) => typeof image === "string" && image.trim() !== "");
  return [...new Set(filtered)];
}

export function getEcoLabel(car) {
  if (car?.environmentalLabel) return String(car.environmentalLabel).toUpperCase();
  if (car?.ecoLabel) return String(car.ecoLabel).toUpperCase();

  const fuel = String(car?.fuel || "").toLowerCase();
  if (fuel.includes("elect") || fuel.includes("hibri")) return "ECO";
  return "C";
}
