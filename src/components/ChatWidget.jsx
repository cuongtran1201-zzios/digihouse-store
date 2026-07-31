import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { fetchMyOrders } from '../lib/ordersApi.js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const STATUS_LABEL_VI = {
  placed: 'Chờ xử lý',
  shipped: 'Đang giao',
  completed: 'Hoàn tất',
  cancelled: 'Đã huỷ',
};

export default function ChatWidget({ customer }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Chào bạn! Mình là trợ lý Digi house, có gì mình giúp được không? 📷' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [myOrdersContext, setMyOrdersContext] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  // Khi khách đã đăng nhập, tự lấy đơn hàng của họ để AI có thể trả lời
  // câu hỏi về trạng thái đơn — chỉ đơn của chính người đang chat.
  useEffect(() => {
    if (!customer) { setMyOrdersContext(''); return; }
    fetchMyOrders()
      .then(orders => {
        if (!orders || orders.length === 0) {
          setMyOrdersContext(`Khách đang chat tên "${customer.name}" hiện chưa có đơn hàng nào.`);
          return;
        }
        const summary = orders.slice(0, 8).map(o => {
          const itemsText = o.items.map(it => `${it.name} x${it.qty}`).join(', ');
          const time = new Date(o.created_at).toLocaleString('vi-VN');
          return `- Đơn #${o.id}: ${itemsText} | Tổng: ${o.total.toLocaleString('vi-VN')}đ | Trạng thái: ${STATUS_LABEL_VI[o.status] || o.status} | Đặt lúc: ${time}`;
        }).join('\n');
        setMyOrdersContext(`Danh sách đơn hàng thật của khách đang chat (tên "${customer.name}"):\n${summary}`);
      })
      .catch(() => setMyOrdersContext(''));
  }, [customer]);

  async function sendMessage(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/smart-endpoint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          customerOrders: myOrdersContext,
        }),
      });
      const data = await res.json();
      const reply = data?.text || 'Xin lỗi, mình chưa trả lời được, bạn thử lại nhé.';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Có lỗi kết nối, bạn thử lại sau nhé.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button className="dh-chat-fab" onClick={() => setOpen(o => !o)} aria-label="Chat với chúng tôi">
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {open && (
        <div className="dh-chat-panel">
          <div className="dh-chat-head">Trợ lý Digi house</div>
          <div className="dh-chat-body">
            {messages.map((m, i) => (
              <div key={i} className={`dh-chat-msg dh-chat-${m.role}`}>{m.content}</div>
            ))}
            {loading && (
              <div className="dh-chat-msg dh-chat-assistant dh-chat-typing">
                <Loader2 size={14} className="dh-spin" /> Đang trả lời...
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <form className="dh-chat-input" onSubmit={sendMessage}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={customer ? 'Nhập câu hỏi (VD: đơn của tôi đến đâu rồi?)' : 'Nhập câu hỏi...'}
              disabled={loading}
            />
            <button type="submit" disabled={loading}><Send size={16} /></button>
          </form>
        </div>
      )}
    </>
  );
}
