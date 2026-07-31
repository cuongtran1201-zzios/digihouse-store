import { supabase } from './supabaseClient.js';

/** Admin: lấy toàn bộ đơn hàng, kèm tên/email khách đặt, mới nhất lên đầu */
export async function fetchOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('id, items, total, status, created_at, customer_id, profiles ( full_name, email )')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

/** Admin: đổi trạng thái đơn hàng (placed / shipped / completed / cancelled) */
export async function updateOrderStatus(id, status) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * Lắng nghe realtime: mỗi khi có đơn hàng MỚI được thêm vào bảng `orders`,
 * gọi callback ngay lập tức (không cần tải lại trang).
 * Trả về hàm huỷ đăng ký (gọi khi rời trang quản trị / đăng xuất).
 */
export function subscribeToNewOrders(onNewOrder) {
  const channel = supabase
    .channel('orders-changes')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'orders' },
      (payload) => onNewOrder(payload.new)
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
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
