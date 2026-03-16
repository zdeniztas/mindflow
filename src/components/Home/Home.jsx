import { useState } from 'react';
import { format } from 'date-fns';
import { Sun, Moon, Plus, Trash2, Check } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { getToday, generateId } from '../../utils/storage';
import { morningPrompts, eveningPrompts, moodEmojis, stoicQuotes } from '../../data/prompts';

export default function Home() {
  const today = getToday();
  const hour = new Date().getHours();
  const isMorning = hour < 12;
  const isEvening = hour >= 17;
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const [morningEntries, setMorningEntries] = useLocalStorage(`morning_${today}`, {});
  const [eveningEntries, setEveningEntries] = useLocalStorage(`evening_${today}`, {});
  const [todos, setTodos] = useLocalStorage(`todos_${today}`, []);
  const [newTodo, setNewTodo] = useState('');
  const [todayMood, setTodayMood] = useLocalStorage(`mood_${today}`, null);

  const dailyQuote = stoicQuotes[Math.floor(new Date(today).getTime() / 86400000) % stoicQuotes.length];

  const addTodo = () => {
    if (!newTodo.trim()) return;
    setTodos([...todos, { id: generateId(), text: newTodo.trim(), done: false }]);
    setNewTodo('');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const removeTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const completedTodos = todos.filter(t => t.done).length;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>{greeting}</h1>
        <p>{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
      </div>

      {/* Daily Quote */}
      <div className="card quote-card mb-24">
        <div className="quote-text">"{dailyQuote.text}"</div>
        <div className="quote-author">- {dailyQuote.author}</div>
      </div>

      {/* Quick Mood */}
      {!todayMood && (
        <div className="card mb-24">
          <div className="card-title mb-16">How are you feeling?</div>
          <div className="mood-selector">
            {moodEmojis.map(m => (
              <button key={m.value} className="mood-btn" onClick={() => setTodayMood(m.value)}>
                <span className="emoji">{m.emoji}</span>
                <span className="label">{m.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {todayMood && (
        <div className="card mb-24" style={{ textAlign: 'center', padding: '16px' }}>
          <span style={{ fontSize: '1.5rem' }}>{moodEmojis.find(m => m.value === todayMood)?.emoji}</span>
          <span className="text-secondary" style={{ marginLeft: 8 }}>
            You're feeling {moodEmojis.find(m => m.value === todayMood)?.label.toLowerCase()} today
          </span>
          <button className="btn btn-sm btn-outline" style={{ marginLeft: 12 }} onClick={() => setTodayMood(null)}>Change</button>
        </div>
      )}

      <div className="grid-2">
        {/* Morning Preparation */}
        <div className="card">
          <div className="card-header">
            <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sun size={20} style={{ color: 'var(--color-warning)' }} />
              Morning Preparation
            </div>
          </div>
          {morningPrompts.slice(0, 3).map((prompt, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <label className="text-sm text-secondary" style={{ display: 'block', marginBottom: 4 }}>{prompt}</label>
              <textarea
                rows={2}
                style={{ width: '100%', minHeight: 60 }}
                value={morningEntries[i] || ''}
                onChange={e => setMorningEntries({ ...morningEntries, [i]: e.target.value })}
                placeholder="Write your thoughts..."
              />
            </div>
          ))}
        </div>

        {/* Evening Reflection */}
        <div className="card">
          <div className="card-header">
            <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Moon size={20} style={{ color: '#6366f1' }} />
              Evening Reflection
            </div>
          </div>
          {eveningPrompts.slice(0, 3).map((prompt, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <label className="text-sm text-secondary" style={{ display: 'block', marginBottom: 4 }}>{prompt}</label>
              <textarea
                rows={2}
                style={{ width: '100%', minHeight: 60 }}
                value={eveningEntries[i] || ''}
                onChange={e => setEveningEntries({ ...eveningEntries, [i]: e.target.value })}
                placeholder="Reflect on your day..."
              />
            </div>
          ))}
        </div>
      </div>

      {/* Daily To-Do */}
      <div className="card mt-24">
        <div className="card-header">
          <div className="card-title">Today's Tasks</div>
          <span className="text-sm text-secondary">{completedTodos}/{todos.length} done</span>
        </div>
        {todos.length > 0 && (
          <div className="progress-bar mb-16">
            <div className="progress-bar-fill" style={{ width: `${todos.length ? (completedTodos / todos.length) * 100 : 0}%` }} />
          </div>
        )}
        {todos.map(todo => (
          <div key={todo.id} className="checkbox-item">
            <button className={`checkbox ${todo.done ? 'checked' : ''}`} onClick={() => toggleTodo(todo.id)}>
              {todo.done && <Check size={14} color="white" />}
            </button>
            <span className={`checkbox-label ${todo.done ? 'completed' : ''}`}>{todo.text}</span>
            <button className="btn-icon" onClick={() => removeTodo(todo.id)} style={{ color: 'var(--color-text-secondary)' }}>
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <div className="todo-input-row mt-8">
          <input
            placeholder="Add a task..."
            value={newTodo}
            onChange={e => setNewTodo(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTodo()}
          />
          <button className="btn btn-primary" onClick={addTodo}>
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
