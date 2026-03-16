import { useState } from 'react';

export default function LockScreen({ password, onUnlock }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input === password) {
      onUnlock();
    } else {
      setError(true);
      setInput('');
      setTimeout(() => setError(false), 1500);
    }
  };

  return (
    <div className="lock-screen">
      <div style={{ fontSize: '3rem' }}>&#x1F512;</div>
      <h2>Mindflow</h2>
      <p className="text-secondary">Enter your PIN to unlock</p>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          className="lock-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          maxLength={6}
          autoFocus
          style={error ? { borderColor: 'var(--color-danger)' } : {}}
        />
      </form>
      {error && <p style={{ color: 'var(--color-danger)', fontSize: '0.85rem' }}>Incorrect PIN</p>}
    </div>
  );
}
