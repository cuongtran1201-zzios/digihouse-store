export const CATEGORIES = ['Casio', 'Sony', 'Canon', 'Nikon', 'Lumix'];

export const CATEGORY_LABEL = {
  Casio: 'Casio Exilim',
  Sony: 'Sony Cyber-shot',
  Canon: 'Canon',
  Nikon: 'Nikon Coolpix',
  Lumix: 'Panasonic Lumix',
};

export const VND = (n) => Number(n || 0).toLocaleString('vi-VN') + '₫';

/** Chuyển 1 dòng từ bảng `products` (snake_case) sang object dùng trong UI (camelCase) */
export function rowToProduct(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: Number(row.price),
    compareAtPrice: row.compare_at_price != null ? Number(row.compare_at_price) : null,
    sensor: row.sensor,
    mount: row.mount,
    iso: row.iso,
    description: row.description,
    image: row.image_url,
    gallery: Array.isArray(row.gallery) ? row.gallery : [],
    videoUrl: row.video_url || null,
    rating: Number(row.rating ?? 5),
    sold: Number(row.sold ?? 0),
  };
}

/** Chuyển object UI (camelCase) sang dòng để insert/update vào bảng `products` */
export function productToRow(product) {
  return {
    name: product.name,
    category: product.category,
    price: product.price,
    compare_at_price: product.compareAtPrice ?? null,
    sensor: product.sensor,
    mount: product.mount,
    iso: product.iso,
    description: product.description,
    image_url: product.image ?? null,
    gallery: product.gallery ?? [],
    video_url: product.videoUrl ?? null,
    rating: product.rating ?? 5,
    sold: product.sold ?? 0,
  };
}
