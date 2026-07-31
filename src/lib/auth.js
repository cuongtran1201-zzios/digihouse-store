import { supabase } from './supabaseClient.js';

export async function signUp(email, password, fullName) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
  if (error) throw error;
  return data;
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

export async function createOrder({ customerId, items, total, paymentMethod = 'cod' }) {
  const { data, error } = await supabase
    .from('orders')
    .insert({ customer_id: customerId, items, total, payment_method: paymentMethod, payment_status: 'unpaid' })
    .select()
    .single();
  if (error) throw error;
  return data;
}
