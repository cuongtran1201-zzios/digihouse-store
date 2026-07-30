import React from 'react';
import { Package, Pencil, Trash2 } from 'lucide-react';
import ProductThumb from '../components/ProductThumb.jsx';
import { CATEGORY_LABEL, VND } from '../data/products.js';

export default function InventoryTable({ products, onDelete, onEdit }) {
  if (products.length === 0) {
    return (
      <div className="dh-empty dh-empty-shop">
        <Package size={32} />
        <p>Chưa có sản phẩm nào. Thêm chiếc máy ảnh đầu tiên để mở gian hàng.</p>
      </div>
    );
  }
  return (
    <div className="dh-table-wrap">
      <table className="dh-table">
        <thead>
          <tr>
            <th></th><th>Tên</th><th>Danh mục</th><th>Giá bán</th><th>Thông số</th><th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => (
            <tr key={p.id} className="dh-row-in" style={{ animationDelay: `${Math.min(i, 10) * 35}ms` }}>
              <td><ProductThumb product={p} size="row" /></td>
              <td className="dh-table-name">{p.name}</td>
              <td><span className="dh-cat-tag">{CATEGORY_LABEL[p.category]}</span></td>
              <td>{VND(p.price)}</td>
              <td className="dh-table-spec">{p.sensor}</td>
              <td className="dh-table-actions">
                <button className="dh-icon-btn" onClick={() => onEdit(p.id)}><Pencil size={15} /></button>
                <button className="dh-icon-btn dh-icon-danger" onClick={() => onDelete(p.id)}><Trash2 size={15} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
