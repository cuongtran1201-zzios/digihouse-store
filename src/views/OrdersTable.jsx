import React, { useState, useRef, useEffect } from 'react';
import { Package, ChevronDown } from 'lucide-react';
import { VND } from '../data/products.js';

const STATUS_LABEL = {
  placed: 'Chờ xử lý',
  shipped: 'Đang giao',
  completed: 'Hoàn tất',
  cancelled: 'Đã huỷ',
};

function StatusBadge({ status, onChange }) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  function handleToggle() {
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setMenuPos({ top: r.bottom + 6, left: r.left });
    }
    setOpen(o => !o);
  }

  useEffect(() => {
    if (!open) return;
    function onScrollOrResize() {
      if (!btnRef.current) return;
      const r = btnRef.current.getBoundingClientRect();
      setMenuPos({ top: r.bottom + 6, left: r.left });
    }
    function onClickOutside(e) {
      const insideBtn = btnRef.current && btnRef.current.contains(e.target);
      const insideMenu = menuRef.current && menuRef.current.contains(e.target);
      if (!insideBtn && !insideMenu) setOpen(false);
    }
    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);
    document.addEventListener('mousedown', onClickOutside);
    return () => {
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [open]);

  return (
    <div className="dh-status-wrap">
      <button ref={btnRef} className={`dh-status-badge dh-status-${status}`} onClick={handleToggle}>
        {STATUS_LABEL[status] || status} <ChevronDown size={12} />
      </button>
      {open && (
        <div ref={menuRef} className="dh-status-menu dh-status-menu-fixed" style={{ top: menuPos.top, left: menuPos.left }}>
          {Object.entries(STATUS_LABEL).map(([key, label]) => (
            <button key={key} onClick={() => { onChange(key); setOpen(false); }}>{label}</button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrdersTable({ orders, onChangeStatus }) {
  if (orders.length === 0) {
    return (
      <div className="dh-empty dh-empty-shop">
        <Package size={32} />
        <p>Chưa có đơn hàng nào. Khi khách đặt hàng, đơn sẽ xuất hiện ở đây ngay lập tức.</p>
      </div>
    );
  }

  return (
    <div className="dh-table-wrap">
      <table className="dh-table">
        <thead>
          <tr>
            <th>Mã đơn</th><th>Khách hàng</th><th>Sản phẩm</th><th>Tổng tiền</th><th>Thời gian</th><th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o, i) => (
            <tr key={o.id} className="dh-row-in" style={{ animationDelay: `${Math.min(i, 10) * 35}ms` }}>
              <td className="dh-table-name">#{o.id}</td>
              <td>
                <div className="dh-order-customer">
                  <span>{o.profiles?.full_name || 'Không rõ'}</span>
                  <span className="dh-order-email">{o.profiles?.email}</span>
                </div>
              </td>
              <td className="dh-table-spec">
                {o.items.map(it => `${it.name} ×${it.qty}`).join(', ')}
              </td>
              <td>{VND(o.total)}</td>
              <td className="dh-table-spec">{new Date(o.created_at).toLocaleString('vi-VN')}</td>
              <td>
                <StatusBadge status={o.status} onChange={(s) => onChangeStatus(o.id, s)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}