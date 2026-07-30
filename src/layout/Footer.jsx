import React from 'react';
import Logo from '../components/Logo.jsx';

export default function Footer({ onAdminClick }) {
  return (
    <footer className="dh-footer">
      <div className="dh-footer-inner">
        <div className="dh-footer-col">
          <Logo size="md" />
          <p>Chuỗi cửa hàng máy ảnh uy tín — hàng chính hãng, bảo hành tận tâm.</p>
        </div>
        <div className="dh-footer-col">
          <h4>Về Digi house</h4>
          <span>Giới thiệu</span><span>Tuyển dụng</span><span>Hệ thống cửa hàng</span>
        </div>
        <div className="dh-footer-col">
          <h4>Chính sách</h4>
          <span>Bảo hành</span><span>Đổi trả</span><span>Vận chuyển</span>
        </div>
        <div className="dh-footer-col">
          <h4>Hỗ trợ khách hàng</h4>
          <span>Hotline: 1800.2097</span><span>hotro@digihouse.vn</span>
        </div>
      </div>
      <div className="dh-footer-bottom">
        © 2026 Digi house. Bản demo giao diện — dữ liệu chỉ lưu tạm trong phiên làm việc.
        <button className="dh-admin-link" onClick={onAdminClick}>Quản trị viên</button>
      </div>
    </footer>
  );
}
