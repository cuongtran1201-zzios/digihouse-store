import React, { useState } from 'react';
import { Store, Mail, Lock, ChevronRight, ArrowLeft } from 'lucide-react';
import { signIn, getProfile } from '../lib/auth.js';
import { supabase } from '../lib/supabaseClient.js';

export default function AdminLogin({ onSuccess, onBack }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  function triggerShake() {
    setShake(true);
    window.setTimeout(() => setShake(false), 400);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { user } = await signIn(email, password);
      const profile = await getProfile(user.id);
      if (profile.role !== 'admin') {
        await supabase.auth.signOut();
        setError('Tài khoản này không có quyền quản trị.');
        setLoading(false);
        triggerShake();
        return;
      }
      onSuccess(user, profile);
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại, vui lòng thử lại.');
      triggerShake();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dh-admin-login">
      <button className="dh-admin-back" onClick={onBack}><ArrowLeft size={15} /> Về trang khách hàng</button>
      <div className={`dh-admin-login-card ${shake ? 'dh-shake' : ''}`}>
        <div className="dh-admin-login-badge"><Store size={22} /></div>
        <h2>Cổng quản trị người bán</h2>
        <p>Khu vực riêng dành cho đội ngũ Digi house. Không dùng chung tài khoản khách hàng.</p>
        <form onSubmit={handleSubmit} className="dh-login-form">
          <label className="dh-field">
            <span>Email quản trị</span>
            <div className="dh-input-icon">
              <Mail size={15} />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@digihouse.vn" required />
            </div>
          </label>
          <label className="dh-field">
            <span>Mật khẩu</span>
            <div className="dh-input-icon">
              <Lock size={15} />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
          </label>
          {error && <span className="dh-login-error">{error}</span>}
          <button type="submit" className="dh-btn-primary dh-login-submit" disabled={loading}>
            {loading ? <><span className="dh-spin dh-inline-spin" /> Đang kiểm tra...</> : <>Đăng nhập quản trị <ChevronRight size={15} /></>}
          </button>
        </form>
        <p className="dh-login-note">
          Chưa có tài khoản admin? Đăng ký như khách hàng ở trang chính, sau đó vào Supabase Dashboard →
          bảng "profiles" → đổi role thành "admin" cho tài khoản đó.
        </p>
      </div>
    </div>
  );
}
