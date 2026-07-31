import { supabase } from './supabaseClient.js';
import { rowToProduct, productToRow } from '../data/products.js';

export async function fetchProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(rowToProduct);
}

export async function createProduct(product) {
  const { data, error } = await supabase
    .from('products')
    .insert(productToRow(product))
    .select()
    .single();
  if (error) throw error;
  return rowToProduct(data);
}

export async function updateProduct(id, product) {
  const { data, error } = await supabase
    .from('products')
    .update(productToRow(product))
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return rowToProduct(data);
}

export async function deleteProduct(id) {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

/** Upload 1 file ảnh lên bucket `product-images`, trả về URL công khai */
export async function uploadProductImage(file) {
  const ext = file.name.split('.').pop();
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from('product-images').upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from('product-images').getPublicUrl(path);
  return data.publicUrl;
}

/** Upload 1 file video lên bucket `product-videos`, trả về URL công khai */
export async function uploadProductVideo(file) {
  const ext = file.name.split('.').pop();
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from('product-videos').upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from('product-videos').getPublicUrl(path);
  return data.publicUrl;
}

/** Khách hàng: lấy đơn hàng của chính mình (RLS tự lọc, chỉ trả về đơn của người đang đăng nhập) */
export async function fetchMyOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('id, items, total, status, created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

/**
 * Khách hàng: lắng nghe realtime khi trạng thái đơn của MÌNH thay đổi
 * (VD admin chuyển "Chờ xử lý" -> "Đang giao"), để cập nhật ngay không cần tải lại trang.
 */
export function subscribeToMyOrderUpdates(customerId, onUpdate) {
  const channel = supabase
    .channel(`my-orders-${customerId}`)
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'orders', filter: `customer_id=eq.${customerId}` },
      (payload) => onUpdate(payload.new)
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
