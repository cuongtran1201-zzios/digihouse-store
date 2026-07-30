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
