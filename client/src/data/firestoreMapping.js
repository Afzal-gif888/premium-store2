// Helper to normalize Firestore document data to safe, predictable shapes
export function normalizeProductData(data = {}, id) {
  const name = data.name || '';
  const category = data.category || '';
  const brand = data.brand || '';

  const images = Array.isArray(data.images)
    ? data.images.map(i => (typeof i === 'string' ? i : (i && i.url) || ''))
    : (data.image ? [data.image] : []);

  const image = data.image || (images.length ? images[0] : '');

  const price = typeof data.price === 'number' ? data.price : (data.price ? parseFloat(data.price) || 0 : 0);

  // Normalize sizes to an array of { size, stock }
  let sizes = [];
  if (Array.isArray(data.sizes)) {
    sizes = data.sizes.map(s => ({
      size: s && s.size ? s.size : '',
      stock: Number((s && s.stock) || 0)
    }));
  } else if (data.sizes && typeof data.sizes === 'object') {
    sizes = Object.keys(data.sizes).map(key => ({ size: key, stock: Number(data.sizes[key] || 0) }));
  }

  const isBestseller = !!data.isBestseller;

  let createdAt = data.createdAt;
  if (createdAt && typeof createdAt.toMillis === 'function') {
    createdAt = createdAt.toMillis();
  } else if (createdAt instanceof Date) {
    createdAt = createdAt.getTime();
  } else if (typeof createdAt !== 'number') {
    createdAt = Date.now();
  }

  return {
    ...data,
    name,
    category,
    brand,
    image,
    images,
    price,
    sizes,
    isBestseller,
    createdAt,
    _id: id,
    id
  };
}
