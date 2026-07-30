import React from 'react';
import ProductForm from './ProductForm.jsx';
import InventoryTable from './InventoryTable.jsx';

export default function SellerView({
  products, adminTab, setAdminTab, editingProduct, onCancelEdit, onSubmit, onDelete, onEdit,
}) {
  return (
    <section className="dh-admin">
      <div className="dh-admin-head">
        <div>
          <span className="dh-eyebrow">Trang quản trị người bán</span>
          <h2>Quản lý gian hàng</h2>
        </div>
        <div className="dh-admin-tabs">
          <button className={`dh-tab ${adminTab === 'inventory' ? 'active' : ''}`}
            onClick={() => { setAdminTab('inventory'); onCancelEdit(); }}>
            Kho hàng ({products.length})
          </button>
          <button className={`dh-tab ${adminTab === 'add' ? 'active' : ''}`} onClick={() => setAdminTab('add')}>
            {editingProduct ? 'Đang chỉnh sửa' : 'Thêm sản phẩm'}
          </button>
        </div>
      </div>

      {adminTab === 'add' ? (
        <ProductForm
          key={editingProduct ? editingProduct.id : 'new'}
          initial={editingProduct}
          onSubmit={onSubmit}
          onCancel={editingProduct ? onCancelEdit : null}
        />
      ) : (
        <InventoryTable products={products} onDelete={onDelete} onEdit={onEdit} />
      )}
    </section>
  );
}
