import { useState } from 'react';
import { format } from 'date-fns';
import { ArrowLeft, Save, Shuffle } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { generateId, getToday } from '../../utils/storage';
import { journalCategories, journalPrompts } from '../../data/prompts';

export default function Journal() {
  const [entries, setEntries] = useLocalStorage('journal_entries', []);
  const [view, setView] = useState('categories'); // categories, prompts, editor
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [entryText, setEntryText] = useState('');
  const [editingId, setEditingId] = useState(null);

  const selectCategory = (cat) => {
    setSelectedCategory(cat);
    const prompts = journalPrompts[cat.id];
    setCurrentPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
    setEntryText('');
    setEditingId(null);
    setView('editor');
  };

  const shufflePrompt = () => {
    if (!selectedCategory) return;
    const prompts = journalPrompts[selectedCategory.id];
    let next;
    do {
      next = prompts[Math.floor(Math.random() * prompts.length)];
    } while (next === currentPrompt && prompts.length > 1);
    setCurrentPrompt(next);
  };

  const saveEntry = () => {
    if (!entryText.trim()) return;
    const entry = {
      id: editingId || generateId(),
      category: selectedCategory?.id || 'free',
      categoryName: selectedCategory?.name || 'Free Write',
      prompt: currentPrompt,
      text: entryText.trim(),
      date: new Date().toISOString(),
      dateKey: getToday(),
      wordCount: entryText.trim().split(/\s+/).length,
    };
    if (editingId) {
      setEntries(entries.map(e => e.id === editingId ? entry : e));
    } else {
      setEntries([entry, ...entries]);
    }
    setView('categories');
    setEntryText('');
    setEditingId(null);
  };

  const startFreeWrite = () => {
    setSelectedCategory(null);
    setCurrentPrompt('');
    setEntryText('');
    setEditingId(null);
    setView('editor');
  };

  const editEntry = (entry) => {
    setSelectedCategory(journalCategories.find(c => c.id === entry.category) || null);
    setCurrentPrompt(entry.prompt);
    setEntryText(entry.text);
    setEditingId(entry.id);
    setView('editor');
  };

  const deleteEntry = (id) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  if (view === 'editor') {
    return (
      <div className="fade-in">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <button className="btn btn-outline btn-sm" onClick={() => setView('categories')}>
            <ArrowLeft size={16} /> Back
          </button>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 600 }}>
            {selectedCategory ? selectedCategory.icon + ' ' + selectedCategory.name : 'Free Write'}
          </h1>
        </div>

        {currentPrompt && (
          <div className="card mb-16" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontStyle: 'italic', flex: 1 }}>{currentPrompt}</p>
            <button className="btn btn-sm btn-outline" onClick={shufflePrompt} title="New prompt">
              <Shuffle size={16} />
            </button>
          </div>
        )}

        <textarea
          style={{ width: '100%', minHeight: 300, fontSize: '1rem', lineHeight: 1.8, padding: 20, background: 'var(--color-surface)', borderRadius: 'var(--radius)' }}
          value={entryText}
          onChange={e => setEntryText(e.target.value)}
          placeholder="Start writing..."
          autoFocus
        />

        <div className="flex-between mt-16">
          <span className="text-sm text-secondary">
            {entryText.trim() ? entryText.trim().split(/\s+/).length : 0} words
          </span>
          <button className="btn btn-primary" onClick={saveEntry} disabled={!entryText.trim()}>
            <Save size={18} /> Save Entry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Journal</h1>
        <p>Choose a topic or write freely</p>
      </div>

      <button className="btn btn-primary mb-24" onClick={startFreeWrite}>
        Start Free Writing
      </button>

      <div className="grid-2 mb-24">
        {journalCategories.map(cat => (
          <div key={cat.id} className="card category-card" onClick={() => selectCategory(cat)}>
            <div className="category-icon" style={{ background: cat.color + '20', color: cat.color }}>
              {cat.icon}
            </div>
            <div className="category-info">
              <h3>{cat.name}</h3>
              <p>{journalPrompts[cat.id].length} prompts</p>
            </div>
          </div>
        ))}
      </div>

      {entries.length > 0 && (
        <>
          <h2 style={{ fontSize: '1.2rem', marginBottom: 16 }}>Recent Entries</h2>
          {entries.slice(0, 10).map(entry => (
            <div key={entry.id} className="card entry-item mb-8" onClick={() => editEntry(entry)}>
              <div className="entry-date">
                {format(new Date(entry.date), 'MMM d, yyyy h:mm a')}
              </div>
              <div className="entry-preview">{entry.text}</div>
              <div className="entry-meta">
                <span>{entry.categoryName}</span>
                <span>{entry.wordCount} words</span>
                <button
                  className="text-sm"
                  style={{ color: 'var(--color-danger)' }}
                  onClick={(e) => { e.stopPropagation(); deleteEntry(entry.id); }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
