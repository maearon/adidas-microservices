'use client';

import { useState } from 'react';

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');

    const res = await fetch('https://ruby-rails-boilerplate-3s9t.onrender.com/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    const reply = data?.choices?.[0]?.message || { role: 'assistant', content: 'Lỗi phản hồi.' };

    setMessages(prev => [...prev, reply]);
  };

  return (
    <div className="container">
      <h2 className="my-4">AI Chat</h2>
      <div className="list-group mb-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`list-group-item ${msg.role === 'user' ? 'list-group-item-info' : 'list-group-item-success'}`}
          >
            <strong>{msg.role}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
        />
        <button className="btn btn-primary" onClick={sendMessage}>Gửi</button>
      </div>
    </div>
  );
}
