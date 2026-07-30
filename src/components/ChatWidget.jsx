import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Chào bạn! Mình là trợ lý Digi house, có gì mình giúp được không? 📷' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

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
              placeholder="Nhập câu hỏi..."
              disabled={loading}
            />
            <button type="submit" disabled={loading}><Send size={16} /></button>
          </form>
        </div>
      )}
    </>
  );
}
