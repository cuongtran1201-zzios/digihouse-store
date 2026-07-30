import React, { useState, useRef } from 'react';
import { Upload, ImageOff, Check, Loader2 } from 'lucide-react';
import { CATEGORIES, CATEGORY_LABEL } from '../data/products.js';
import { uploadProductImage } from '../lib/productsApi.js';

export default function ProductForm({ initial, onSubmit, onCancel }) {
  const [name, setName] = useState(initial?.name || '');
  const [category, setCategory] = useState(initial?.category || CATEGORIES[0]);
  const [price, setPrice] = useState(initial?.price ?? '');
  const [compareAtPrice, setCompareAtPrice] = useState(initial?.compareAtPrice ?? '');
  const [sensor, setSensor] = useState(initial?.sensor || '');
  const [mount, setMount] = useState(initial?.mount || '');
  const [iso, setIso] = useState(initial?.iso || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [image, setImage] = useState(initial?.image || null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const url = await uploadProductImage(file);
      setImage(url);
    } catch (err) {
      setError('Tải ảnh lên thất bại: ' + (err.message || 'lỗi không xác định'));
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !price || uploading) return;
    setSubmitting(true);
    setError('');
    try {
      await onSubmit({
        name: name.trim(),
        category,
        price: Number(price),
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
        sensor: sensor.trim() || '—',
        mount: mount.trim() || '—',
        iso: iso.trim() || '—',
        description: description.trim() || 'Chưa có mô tả.',
        image,
        rating: initial?.rating ?? 5,
        sold: initial?.sold ?? 0,
      });
    } catch (err) {
      setError(err.message || 'Lưu sản phẩm thất bại.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="dh-form" onSubmit={handleSubmit}>
      <div className="dh-form-grid">
        <div className="dh-form-main">
          <label className="dh-field">
            <span>Tên sản phẩm</span>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="VD: Solstice R1" required />
          </label>

          <div className="dh-field-row">
            <label className="dh-field">
              <span>Danh mục</span>
              <select value={category} onChange={e => setCategory(e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>)}
              </select>
            </label>
            <label className="dh-field">
              <span>Giá bán (VNĐ)</span>
              <input type="number" min="0" value={price} onChange={e => setPrice(e.target.value)} placeholder="9990000" required />
            </label>
            <label className="dh-field">
              <span>Giá gốc (không bắt buộc)</span>
              <input type="number" min="0" value={compareAtPrice} onChange={e => setCompareAtPrice(e.target.value)} placeholder="12490000" />
            </label>
          </div>

          <div className="dh-field-row dh-field-row-3">
            <label className="dh-field">
              <span>Độ phân giải</span>
              <input value={sensor} onChange={e => setSensor(e.target.value)} placeholder="16.1MP" />
            </label>
            <label className="dh-field">
              <span>Zoom quang học</span>
              <input value={mount} onChange={e => setMount(e.target.value)} placeholder="12.5x" />
            </label>
            <label className="dh-field">
              <span>Tình trạng máy</span>
              <input value={iso} onChange={e => setIso(e.target.value)} placeholder="98% - còn rất mới" />
            </label>
          </div>

          <label className="dh-field">
            <span>Mô tả</span>
            <textarea rows={4} value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Điều gì khiến chiếc máy này đáng mua?" />
          </label>

          {error && <span className="dh-login-error">{error}</span>}
        </div>

        <div className="dh-form-side">
          <span className="dh-field-label">Hình ảnh sản phẩm</span>
          <div className="dh-dropzone" onClick={() => !uploading && fileRef.current?.click()}>
            {uploading ? (
              <div className="dh-dropzone-empty">
                <Loader2 size={22} className="dh-spin" />
                <span>Đang tải ảnh lên...</span>
              </div>
            ) : image ? (
              <img src={image} alt="Xem trước" />
            ) : (
              <div className="dh-dropzone-empty">
                <Upload size={22} />
                <span>Nhấn để tải ảnh lên</span>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} hidden />
          {image && !uploading && (
            <button type="button" className="dh-link-btn" onClick={() => setImage(null)}>
              <ImageOff size={13} /> Xoá ảnh
            </button>
          )}
        </div>
      </div>

      <div className="dh-form-actions">
        {onCancel && <button type="button" className="dh-btn-secondary" onClick={onCancel}>Huỷ</button>}
        <button type="submit" className="dh-btn-primary" disabled={uploading || submitting}>
          {submitting ? 'Đang lưu...' : onCancel ? 'Lưu thay đổi' : 'Thêm vào gian hàng'} <Check size={15} />
        </button>
      </div>
    </form>
  );
}
