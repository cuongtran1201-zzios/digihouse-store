import React, { useState } from 'react';
import { X, ChevronRight } from 'lucide-react';
import Logo from './Logo.jsx';
import { signIn, signUp } from '../lib/auth.js';

export default function CustomerLoginModal({ onClose, onLoggedIn }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  function triggerShake() {
    setShake(true);
    window.setTimeout(() => setShake(false), 400);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);
    try {
      if (mode === 'signup') {
        const data = await signUp(email, password, fullName);
        if (!data.session) {
          // Dự án Supabase mặc định yêu cầu xác nhận email trước khi đăng nhập được
          setInfo('Đăng ký thành công! Kiểm tra email để xác nhận tài khoản trước khi đăng nhập.');
          setLoading(false);
          return;
        }
        onLoggedIn(data.session.user);
      } else {
        const data = await signIn(email, password);
        onLoggedIn(data.user);
      }
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra, vui lòng thử lại.');
      triggerShake();
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="dh-overlay" onClick={onClose} />
      <div className={`dh-login-modal dh-modal-in ${shake ? 'dh-shake' : ''}`}>
        <button className="dh-icon-btn dh-login-close" onClick={onClose}><X size={16} /></button>
        <Logo size="md" />
        <h3 key={`title-${mode}`} className="dh-fade-swap">{mode === 'signup' ? 'Tạo tài khoản khách hàng' : 'Đăng nhập khách hàng'}</h3>
        <p className="dh-login-sub">Đăng nhập để lưu giỏ hàng và theo dõi đơn hàng của bạn.</p>
        <form onSubmit={handleSubmit} className="dh-login-form" key={mode}>
          {mode === 'signup' && (
            <label className="dh-field dh-fade-swap">
              <span>Họ tên</span>
              <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Nguyễn Văn A" required />
            </label>
          )}
          <label className="dh-field dh-fade-swap">
            <span>Email</span>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ban@email.com" required />
          </label>
          <label className="dh-field dh-fade-swap">
            <span>Mật khẩu</span>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Ít nhất 6 ký tự" minLength={6} required />
          </label>
          {error && <span className="dh-login-error">{error}</span>}
          {info && <span className="dh-login-info">{info}</span>}
          <button type="submit" className="dh-btn-primary dh-login-submit" disabled={loading}>
            {loading ? <><span className="dh-spin dh-inline-spin" /> Đang xử lý...</> : <>{mode === 'signup' ? 'Đăng ký' : 'Đăng nhập'} <ChevronRight size={15} /></>}
          </button>
        </form>
        <button
          type="button"
          className="dh-link-btn dh-login-switch"
          onClick={() => { setMode(mode === 'signup' ? 'login' : 'signup'); setError(''); setInfo(''); }}
        >
          {mode === 'signup' ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký ngay'}
        </button>
      </div>
    </>
  );
}
