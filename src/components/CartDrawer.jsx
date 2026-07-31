import React, { useState } from 'react';
import { X, Check, Package, Minus, Plus, Trash2, ChevronRight, Wallet, Landmark } from 'lucide-react';
import ProductThumb from './ProductThumb.jsx';
import { VND } from '../data/products.js';

export default function CartDrawer({
  cartItems,
  cartTotal,
  orderPlaced,
  placing,
  onClose,
  onChangeQty,
  onRemove,
  onPlaceOrder,
  onContinueShopping,
}) {
  const [removingIds, setRemovingIds] = useState(() => new Set());
  const [paymentMethod, setPaymentMethod] = useState('cod');

  function handleRemove(id) {
    setRemovingIds(prev => new Set(prev).add(id));
    window.setTimeout(() => onRemove(id), 220);
  }

  function handlePlaceOrder() {
    onPlaceOrder(paymentMethod);
  }

  return (
    <>
      <div className="dh-overlay" onClick={onClose} />
      <div className="dh-drawer">
        <div className="dh-drawer-head">
          <h3>Giỏ hàng của bạn</h3>
          <button className="dh-icon-btn" onClick={onClose}><X size={18} /></button>
        </div>

        {orderPlaced ? (
          <div className="dh-order-confirm">
            <div className="dh-order-check">
              <span className="dh-order-ring" />
              <Check size={26} />
            </div>
            <h4>Đặt hàng thành công</h4>
            <p>
              {paymentMethod === 'cod'
                ? 'Đơn hàng đã được ghi nhận. Bạn thanh toán tiền mặt khi nhận hàng.'
                : 'Đơn hàng đã được ghi nhận. Vui lòng chuyển khoản theo thông tin shop gửi qua hotline/Zalo để đơn được xử lý nhanh nhất.'}
            </p>
            <button className="dh-btn-secondary" onClick={onContinueShopping}>
              Tiếp tục mua sắm
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="dh-empty">
            <Package size={32} />
            <p>Giỏ hàng đang trống. Ghé shelf chọn một chiếc máy ảnh ưng ý nhé.</p>
          </div>
        ) : (
          <>
            <div className="dh-drawer-items">
              {cartItems.map(({ product, qty }) => (
                <div
                  className={`dh-drawer-item ${removingIds.has(product.id) ? 'dh-drawer-item-removing' : ''}`}
                  key={product.id}
                >
                  <ProductThumb product={product} size="row" />
                  <div className="dh-drawer-item-info">
                    <span className="dh-drawer-item-name">{product.name}</span>
                    <span className="dh-drawer-item-price">{VND(product.price)}</span>
                  </div>
                  <div className="dh-qty">
                    <button onClick={() => onChangeQty(product.id, -1)}><Minus size={13} /></button>
                    <span>{qty}</span>
                    <button onClick={() => onChangeQty(product.id, 1)}><Plus size={13} /></button>
                  </div>
                  <button className="dh-icon-btn" onClick={() => handleRemove(product.id)}>
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>

            <div className="dh-payment-select">
              <span className="dh-payment-label">Phương thức thanh toán</span>
              <button
                type="button"
                className={`dh-payment-option ${paymentMethod === 'cod' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('cod')}
              >
                <Wallet size={16} />
                <div>
                  <span className="dh-payment-title">Thanh toán khi nhận hàng (COD)</span>
                  <span className="dh-payment-desc">Trả tiền mặt cho shipper</span>
                </div>
              </button>
              <button
                type="button"
                className={`dh-payment-option ${paymentMethod === 'transfer' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('transfer')}
              >
                <Landmark size={16} />
                <div>
                  <span className="dh-payment-title">Chuyển khoản online</span>
                  <span className="dh-payment-desc">Shop gửi thông tin qua hotline/Zalo</span>
                </div>
              </button>
            </div>

            <div className="dh-drawer-total">
              <span>Tạm tính</span>
              <span>{VND(cartTotal)}</span>
            </div>
            <button className="dh-btn-primary dh-checkout" onClick={handlePlaceOrder} disabled={placing}>
              {placing ? <><span className="dh-spin dh-inline-spin" /> Đang đặt hàng...</> : <>Đặt hàng ngay <ChevronRight size={16} /></>}
            </button>
          </>
        )}
      </div>
    </>
  );
}
