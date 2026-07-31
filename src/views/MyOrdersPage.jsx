import React from 'react';
import { ArrowLeft, Package, Wallet, Landmark, Check, X as XIcon } from 'lucide-react';
import { VND } from '../data/products.js';

const STATUS_LABEL = {
  placed: 'Chờ xử lý',
  shipped: 'Đang giao',
  completed: 'Hoàn tất',
  cancelled: 'Đã huỷ',
};

const PAYMENT_METHOD_LABEL = { cod: 'COD', transfer: 'Chuyển khoản' };

const STATUS_STEPS = ['placed', 'shipped', 'completed'];

function StatusTimeline({ status }) {
  if (status === 'cancelled') {
    return <span className="dh-status-badge dh-status-cancelled">Đã huỷ</span>;
  }
  const currentIdx = STATUS_STEPS.indexOf(status);
  return (
    <div className="dh-order-timeline">
      {STATUS_STEPS.map((step, i) => (
        <React.Fragment key={step}>
          <div className={`dh-order-step ${i <= currentIdx ? 'done' : ''}`}>
            <span className="dh-order-step-dot" />
            <span className="dh-order-step-label">{STATUS_LABEL[step]}</span>
          </div>
          {i < STATUS_STEPS.length - 1 && <span className={`dh-order-step-line ${i < currentIdx ? 'done' : ''}`} />}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function MyOrdersPage({ orders, loading, onBack }) {
  return (
    <section className="dh-detail dh-myorders">
      <button className="dh-detail-back" onClick={onBack}>
        <ArrowLeft size={16} /> Về trang chủ
      </button>

      <h1 className="dh-myorders-title">Đơn hàng của tôi</h1>

      {loading ? (
        <p className="dh-myorders-loading">Đang tải đơn hàng...</p>
      ) : orders.length === 0 ? (
        <div className="dh-empty dh-empty-shop">
          <Package size={32} />
          <p>Bạn chưa có đơn hàng nào. Ghé shelf chọn một chiếc máy ảnh ưng ý nhé.</p>
        </div>
      ) : (
        <div className="dh-myorders-list">
          {orders.map(o => (
            <div className="dh-myorders-card" key={o.id}>
              <div className="dh-myorders-head">
                <span className="dh-table-name">Đơn #{o.id}</span>
                <span className="dh-table-spec">{new Date(o.created_at).toLocaleString('vi-VN')}</span>
              </div>
              <div className="dh-payment-cell" style={{ marginBottom: 14 }}>
                <span className="dh-payment-method-tag">
                  {o.payment_method === 'transfer' ? <Landmark size={12} /> : <Wallet size={12} />}
                  {PAYMENT_METHOD_LABEL[o.payment_method] || o.payment_method}
                </span>
                <span className={`dh-paystatus-badge ${o.payment_status === 'paid' ? 'dh-paystatus-paid' : 'dh-paystatus-unpaid'}`}>
                  {o.payment_status === 'paid' ? <Check size={12} /> : <XIcon size={12} />}
                  {o.payment_status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </span>
              </div>
              <StatusTimeline status={o.status} />
              <div className="dh-myorders-items">
                {o.items.map((it, i) => (
                  <div className="dh-myorders-item" key={i}>
                    <span>{it.name} × {it.qty}</span>
                    <span>{VND(it.price * it.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="dh-drawer-total">
                <span>Tổng tiền</span>
                <span>{VND(o.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
