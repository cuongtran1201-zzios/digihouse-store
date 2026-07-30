# Digi house — Website bán máy ảnh (đã nối Supabase)

Website bán máy ảnh, xây bằng **React + Vite**, dữ liệu và đăng nhập chạy qua **Supabase**
(PostgreSQL + Auth + Storage). Có 2 khu vực tách biệt:

- **Trang khách hàng** — xem sản phẩm (lấy từ database thật), lọc danh mục, Flash Sale, giỏ hàng,
  đăng ký/đăng nhập bằng email thật.
- **Trang quản trị (Admin)** — cổng đăng nhập riêng (link "Quản trị viên" ở cuối footer), chỉ tài
  khoản có role `admin` mới vào được, thêm/sửa/xoá sản phẩm + upload ảnh lên Supabase Storage.

## 1. Tạo project Supabase

1. Vào [supabase.com](https://supabase.com) → tạo project mới (miễn phí).
2. Vào **SQL Editor** → dán toàn bộ nội dung file `supabase/schema.sql` → chạy (Run).
   File này sẽ tạo:
   - Bảng `profiles` (hồ sơ + phân quyền `customer`/`admin`, tự tạo khi có người đăng ký)
   - Bảng `products` (sản phẩm — có sẵn 5 sản phẩm mẫu)
   - Bảng `orders` (đơn hàng)
   - Row Level Security cho từng bảng (khách chỉ xem được sản phẩm, chỉ admin mới sửa/xoá được)
   - Bucket Storage `product-images` để lưu ảnh sản phẩm
3. Vào **Project Settings → API** → copy **Project URL** và **anon public key**.

## 2. Cấu hình project frontend

```bash
cp .env.example .env
```

Mở `.env` và điền:

```
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Cài đặt & chạy:

```bash
npm install
npm run dev
```

## 3. Tạo tài khoản admin đầu tiên

Vì lý do bảo mật, **không ai tự đăng ký thành admin được** — mọi tài khoản mới đều mặc định là
`customer`. Để có tài khoản admin:

1. Vào web, bấm "Đăng nhập" → chọn "Đăng ký" → tạo tài khoản bằng email/mật khẩu bất kỳ.
2. Nếu project Supabase bật xác nhận email (mặc định), kiểm tra email để xác nhận.
3. Vào Supabase Dashboard → **Table Editor → profiles** → tìm dòng ứng với tài khoản đó →
   sửa cột `role` từ `customer` thành `admin`.
4. Quay lại web → cuộn xuống footer → bấm "Quản trị viên" → đăng nhập bằng đúng email/mật khẩu đó.

## Cấu trúc thư mục

```
supabase/
└── schema.sql            # SQL tạo bảng, RLS, bucket ảnh — chạy 1 lần trên Supabase

src/
├── main.jsx               # Điểm khởi chạy React
├── App.jsx                # State chính, tải dữ liệu & phiên đăng nhập từ Supabase
├── index.css               # Toàn bộ style/animation
├── lib/
│   ├── supabaseClient.js   # Khởi tạo Supabase client (đọc từ .env)
│   ├── productsApi.js      # CRUD sản phẩm + upload ảnh lên Storage
│   └── auth.js             # Đăng ký / đăng nhập / đăng xuất / lấy hồ sơ / tạo đơn hàng
├── data/
│   └── products.js         # Danh mục + hàm map dữ liệu DB (snake_case) ↔ UI (camelCase)
├── components/              # Logo, Stars, ProductThumb, Countdown, Reveal, Toast,
│                             # CartDrawer, CustomerLoginModal, AdminLogin, AdminShell
├── layout/
│   ├── Header.jsx
│   └── Footer.jsx
└── views/
    ├── CustomerView.jsx
    ├── ProductCard.jsx
    ├── SellerView.jsx
    ├── ProductForm.jsx      # Form thêm/sửa sản phẩm — upload ảnh thật lên Supabase Storage
    └── InventoryTable.jsx
```

## Đẩy lên GitHub

**Quan trọng:** file `.env` chứa key thật đã được thêm vào `.gitignore` — không bao giờ commit
file này lên GitHub công khai.

```bash
git init
git add .
git commit -m "Digi house camera store — Supabase integration"
git branch -M main
git remote add origin <URL_REPO_CUA_BAN>
git push -u origin main
```

## Giới hạn hiện tại (điểm cần biết)

- Trình duyệt chỉ giữ **1 phiên đăng nhập Supabase tại một thời điểm** — nếu vừa đăng nhập khách
  hàng vừa đăng nhập admin trên cùng 1 trình duyệt, phiên sau sẽ ghi đè phiên trước.
- Giỏ hàng vẫn chỉ lưu tạm trên trình duyệt (chưa đồng bộ real-time nhiều thiết bị); chỉ khi
  **đặt hàng** thì đơn hàng mới được ghi vào bảng `orders`.
- Mặc định Supabase yêu cầu xác nhận email khi đăng ký — có thể tắt ở
  **Authentication → Providers → Email → Confirm email** nếu muốn test nhanh không cần check mail.
- Chưa có trang xem lại lịch sử đơn hàng cho khách hoặc admin — dữ liệu đã nằm trong bảng `orders`,
  chỉ cần làm thêm UI khi cần.
