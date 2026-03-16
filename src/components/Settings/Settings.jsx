import { useState } from 'react';
import { Download, Trash2, Lock, Unlock } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useTheme } from '../../hooks/useTheme';
import { colorThemes } from '../../data/prompts';

export default function Settings() {
  const { themeId, setThemeId } = useTheme();
  const [password, setPassword] = useLocalStorage('password', '');
  const [newPin, setNewPin] = useState('');
  const [showPinInput, setShowPinInput] = useState(false);

  const setPin = () => {
    if (newPin.length >= 4) {
      setPassword(newPin);
      setNewPin('');
      setShowPinInput(false);
    }
  };

  const removePin = () => {
    setPassword('');
  };

  const exportData = () => {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('stoic_')) {
        data[key] = localStorage.getItem(key);
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindflow-journal-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        Object.entries(data).forEach(([key, value]) => {
          localStorage.setItem(key, value);
        });
        window.location.reload();
      } catch {
        alert('Invalid file format');
      }
    };
    reader.readAsText(file);
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to delete ALL data? This cannot be undone.')) {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('stoic_')) keys.push(key);
      }
      keys.forEach(k => localStorage.removeItem(k));
      window.location.reload();
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Customize your Mindflow experience</p>
      </div>

      {/* Color Theme */}
      <div className="settings-section">
        <h3>Color Theme</h3>
        <div className="theme-grid">
          {colorThemes.map(theme => (
            <div
              key={theme.id}
              className={`theme-option ${themeId === theme.id ? 'selected' : ''}`}
              onClick={() => setThemeId(theme.id)}
              style={{ background: theme.surface }}
            >
              <div className="theme-swatch" style={{ background: theme.primary }} />
              <div className="theme-name" style={{ color: theme.text }}>{theme.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy */}
      <div className="settings-section">
        <h3>Privacy & Security</h3>
        <div className="card">
          <div className="flex-between">
            <div>
              <div className="font-semibold">PIN Lock</div>
              <div className="text-sm text-secondary">
                {password ? 'Your journal is protected with a PIN' : 'Add a PIN to protect your journal'}
              </div>
            </div>
            {password ? (
              <button className="btn btn-outline btn-sm" onClick={removePin}>
                <Unlock size={16} /> Remove PIN
              </button>
            ) : (
              <button className="btn btn-primary btn-sm" onClick={() => setShowPinInput(true)}>
                <Lock size={16} /> Set PIN
              </button>
            )}
          </div>
          {showPinInput && !password && (
            <div className="mt-16" style={{ display: 'flex', gap: 8 }}>
              <input
                type="password"
                placeholder="Enter 4-6 digit PIN"
                value={newPin}
                onChange={e => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                style={{ width: 200 }}
              />
              <button className="btn btn-primary btn-sm" onClick={setPin} disabled={newPin.length < 4}>
                Save
              </button>
              <button className="btn btn-outline btn-sm" onClick={() => { setShowPinInput(false); setNewPin(''); }}>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Data Management */}
      <div className="settings-section">
        <h3>Data Management</h3>
        <div className="card mb-16">
          <div className="flex-between">
            <div>
              <div className="font-semibold">Export Data</div>
              <div className="text-sm text-secondary">Download all your journal data as JSON</div>
            </div>
            <button className="btn btn-primary btn-sm" onClick={exportData}>
              <Download size={16} /> Export
            </button>
          </div>
        </div>

        <div className="card mb-16">
          <div className="flex-between">
            <div>
              <div className="font-semibold">Import Data</div>
              <div className="text-sm text-secondary">Restore from a previous export</div>
            </div>
            <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
              Import
              <input type="file" accept=".json" onChange={importData} style={{ display: 'none' }} />
            </label>
          </div>
        </div>

        <div className="card">
          <div className="flex-between">
            <div>
              <div className="font-semibold" style={{ color: 'var(--color-danger)' }}>Delete All Data</div>
              <div className="text-sm text-secondary">Permanently delete all your data</div>
            </div>
            <button className="btn btn-danger btn-sm" onClick={clearAllData}>
              <Trash2 size={16} /> Delete All
            </button>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="settings-section">
        <h3>About</h3>
        <div className="card">
          <div className="font-semibold mb-8">Mindflow — Journal & Mental Health</div>
          <div className="text-sm text-secondary mb-8">
            Your personal mental health companion. Track your moods, build habits,
            journal with purpose, and grow every day.
          </div>
          <div className="text-sm text-secondary">
            All data is stored locally on your device. Nothing is sent to any server.
          </div>
        </div>
      </div>
    </div>
  );
}
