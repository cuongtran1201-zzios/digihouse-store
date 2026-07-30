-- ============================================================
-- Digi house — Supabase schema
-- Chạy toàn bộ file này trong Supabase Dashboard → SQL Editor
-- ============================================================

-- ---------- 1. PROFILES (mở rộng cho auth.users) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Ai cũng xem được profile của chính mình
create policy "Người dùng xem được profile của mình"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

-- Không cho phép người dùng tự sửa role của mình (chặn tự phong admin)
create policy "Người dùng chỉ được sửa tên, không sửa role"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id and role = (select role from public.profiles where id = auth.uid()));

-- Trigger: tự tạo profile khi có user đăng ký mới, LUÔN gán role = 'customer'
-- (bỏ qua bất kỳ role nào client gửi lên, để tránh leo thang đặc quyền)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), new.email, 'customer');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ---------- 2. PRODUCTS ----------
create table if not exists public.products (
  id bigint generated always as identity primary key,
  name text not null,
  category text not null,
  price bigint not null,
  compare_at_price bigint,
  sensor text,
  mount text,
  iso text,
  description text,
  image_url text,
  rating numeric default 5,
  sold integer default 0,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

-- Ai cũng xem được sản phẩm (kể cả khách chưa đăng nhập) — trang khách hàng là public
create policy "Ai cũng xem được sản phẩm"
  on public.products for select
  to anon, authenticated
  using (true);

-- Chỉ admin mới được thêm/sửa/xoá sản phẩm
create policy "Chỉ admin được thêm sản phẩm"
  on public.products for insert
  to authenticated
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Chỉ admin được sửa sản phẩm"
  on public.products for update
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Chỉ admin được xoá sản phẩm"
  on public.products for delete
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));


-- ---------- 3. ORDERS ----------
create table if not exists public.orders (
  id bigint generated always as identity primary key,
  customer_id uuid not null references auth.users (id),
  items jsonb not null,       -- [{ product_id, name, price, qty }]
  total bigint not null,
  status text not null default 'placed',
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

-- Khách hàng chỉ xem được đơn hàng của chính mình
create policy "Khách hàng xem đơn hàng của mình"
  on public.orders for select
  to authenticated
  using (auth.uid() = customer_id);

-- Khách hàng chỉ được tạo đơn hàng cho chính mình
create policy "Khách hàng tự đặt hàng"
  on public.orders for insert
  to authenticated
  with check (auth.uid() = customer_id);

-- Admin xem được toàn bộ đơn hàng
create policy "Admin xem toàn bộ đơn hàng"
  on public.orders for select
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));


-- ---------- 4. STORAGE: bucket lưu ảnh sản phẩm ----------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Ai cũng xem được ảnh sản phẩm"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');

create policy "Chỉ admin được tải ảnh sản phẩm lên"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'product-images'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Chỉ admin được xoá ảnh sản phẩm"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'product-images'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );


-- ---------- 5. Dữ liệu mẫu (tuỳ chọn — có thể xoá nếu không cần) ----------
insert into public.products (name, category, price, compare_at_price, sensor, mount, iso, description, rating, sold)
values
  ('Solstice R1', 'Rangefinder', 9990000, 12490000, 'Phim 35mm', 'Ngàm M', 'ISO 100–3200',
   'Máy đo xa lên dây cót tay, dành cho người chụp chậm rãi: đo sáng, lấy nét, hít thở, bấm máy.', 4.8, 214),
  ('Halcyon M5', 'Mirrorless', 29990000, 33990000, 'Full-frame · 24MP', 'Ngàm RF', 'ISO 100–51200',
   'Đủ nhanh cho sân bóng, đủ êm cho phòng trẻ ngủ.', 4.9, 356),
  ('Atlas DX2', 'DSLR', 20990000, null, 'APS-C · 26MP', 'Ngàm EF', 'ISO 100–25600',
   'Cỗ máy bền bỉ. Pin trâu hơn cả tiệc cưới.', 4.7, 189),
  ('Pronto 8', 'Instant', 2090000, 2490000, 'Phim lấy liền', 'Fix 60mm', 'ISO 800',
   'Bấm nút, đợi 8 giây, giữ trọn khoảnh khắc.', 4.6, 502),
  ('Wanderer FM', 'Film', 5990000, null, 'Phim 35mm', 'Fix 40mm f/1.9', 'ISO 100–1600',
   'Không màn hình, không menu, không tiếc nuối.', 4.9, 97)
on conflict do nothing;

-- ============================================================
-- SAU KHI CHẠY XONG FILE NÀY:
-- 1. Vào trang web, bấm "Đăng nhập" (khách hàng) và tạo 1 tài khoản bất kỳ
--    bằng email thật của bạn — để dùng làm tài khoản admin.
-- 2. Quay lại đây, chạy lệnh dưới (thay email cho đúng) để nâng quyền admin:
--
--    update public.profiles set role = 'admin' where email = 'ban@email.com';
--
-- 3. Đăng xuất khỏi web, vào link "Quản trị viên" ở footer, đăng nhập lại
--    bằng đúng email/mật khẩu đó — giờ sẽ vào được trang quản trị thật.
-- ============================================================
