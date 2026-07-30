export const CATEGORIES = ['Rangefinder', 'Mirrorless', 'DSLR', 'Instant', 'Film'];

export const CATEGORY_LABEL = {
  Rangefinder: 'Máy đo xa',
  Mirrorless: 'Không gương lật',
  DSLR: 'DSLR',
  Instant: 'Ảnh lấy liền',
  Film: 'Máy phim',
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
    rating: product.rating ?? 5,
    sold: product.sold ?? 0,
  };
}
