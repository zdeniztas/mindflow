import { useState } from 'react';
import { format, subDays } from 'date-fns';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { getToday } from '../../utils/storage';
import { moodEmojis, emotions } from '../../data/prompts';

export default function MoodTracker() {
  const today = getToday();
  const [moodLog, setMoodLog] = useLocalStorage('mood_log', []);
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [note, setNote] = useState('');

  const todayEntry = moodLog.find(e => e.dateKey === today);

  const toggleEmotion = (emotion) => {
    setSelectedEmotions(prev =>
      prev.includes(emotion) ? prev.filter(e => e !== emotion) : [...prev, emotion]
    );
  };

  const saveMood = () => {
    if (!selectedMood) return;
    const entry = {
      dateKey: today,
      date: new Date().toISOString(),
      mood: selectedMood,
      emotions: selectedEmotions,
      note: note.trim(),
    };
    // Replace today's entry or add new
    const existing = moodLog.findIndex(e => e.dateKey === today);
    if (existing >= 0) {
      const updated = [...moodLog];
      updated[existing] = entry;
      setMoodLog(updated);
    } else {
      setMoodLog([entry, ...moodLog]);
    }
    // Also save for home page
    localStorage.setItem('stoic_mood_' + today, JSON.stringify(selectedMood));
    setSelectedMood(null);
    setSelectedEmotions([]);
    setNote('');
  };

  // Last 7 days
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), 6 - i);
    const key = d.toISOString().split('T')[0];
    const entry = moodLog.find(e => e.dateKey === key);
    return { date: d, key, entry };
  });

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Mood Tracker</h1>
        <p>Track how you feel throughout the day</p>
      </div>

      {/* Log Mood */}
      <div className="card mb-24">
        <div className="card-title mb-16">How are you feeling right now?</div>
        <div className="mood-selector">
          {moodEmojis.map(m => (
            <button
              key={m.value}
              className={`mood-btn ${selectedMood === m.value ? 'selected' : ''}`}
              onClick={() => setSelectedMood(m.value)}
            >
              <span className="emoji">{m.emoji}</span>
              <span className="label">{m.label}</span>
            </button>
          ))}
        </div>

        {selectedMood && (
          <>
            <div className="divider" />
            <div className="card-title mb-8">What emotions are you experiencing?</div>
            <div className="tags-wrap mb-16">
              {emotions.map(e => (
                <button
                  key={e}
                  className={`tag ${selectedEmotions.includes(e) ? 'selected' : ''}`}
                  onClick={() => toggleEmotion(e)}
                >
                  {e}
                </button>
              ))}
            </div>

            <textarea
              placeholder="Add a note about how you're feeling (optional)..."
              value={note}
              onChange={e => setNote(e.target.value)}
              style={{ width: '100%', marginBottom: 16 }}
              rows={3}
            />

            <button className="btn btn-primary" onClick={saveMood}>Save Mood</button>
          </>
        )}
      </div>

      {/* 7-Day Overview */}
      <div className="card mb-24">
        <div className="card-title mb-16">Last 7 Days</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
          {last7.map(day => (
            <div key={day.key} style={{ textAlign: 'center', flex: 1 }}>
              <div className="text-sm text-secondary">{format(day.date, 'EEE')}</div>
              <div style={{ fontSize: '1.8rem', margin: '8px 0' }}>
                {day.entry ? moodEmojis.find(m => m.value === day.entry.mood)?.emoji : '---'}
              </div>
              <div className="text-sm text-secondary">{format(day.date, 'd')}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mood History */}
      {moodLog.length > 0 && (
        <div className="card">
          <div className="card-title mb-16">Mood History</div>
          {moodLog.slice(0, 20).map((entry, i) => (
            <div key={i} className="checkbox-item" style={{ borderBottom: '1px solid var(--color-primary-alpha)' }}>
              <span style={{ fontSize: '1.5rem' }}>{moodEmojis.find(m => m.value === entry.mood)?.emoji}</span>
              <div style={{ flex: 1 }}>
                <div className="text-sm font-semibold">
                  {format(new Date(entry.date), 'MMM d, yyyy h:mm a')}
                </div>
                {entry.emotions.length > 0 && (
                  <div className="text-sm text-secondary">{entry.emotions.join(', ')}</div>
                )}
                {entry.note && <div className="text-sm mt-8" style={{ fontStyle: 'italic' }}>{entry.note}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
