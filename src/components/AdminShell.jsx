import React from 'react';
import { LogOut } from 'lucide-react';
import Logo from './Logo.jsx';

export default function AdminShell({ children, onLogout }) {
  return (
    <div className="dh-admin-shell">
      <header className="dh-admin-topbar">
        <div className="dh-admin-topbar-inner">
          <Logo size="md" />
          <span className="dh-admin-topbar-tag">Trang quản trị</span>
          <button className="dh-admin-logout" onClick={onLogout}><LogOut size={14} /> Đăng xuất</button>
        </div>
      </header>
      {children}
    </div>
  );
}
