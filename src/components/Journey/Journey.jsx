import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Search, Calendar, BookOpen } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { moodEmojis, journalCategories } from '../../data/prompts';

export default function Journey() {
  const [journalEntries] = useLocalStorage('journal_entries', []);
  const [moodLog] = useLocalStorage('mood_log', []);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  // Combine and sort all entries
  const allEntries = useMemo(() => {
    const entries = [];

    journalEntries.forEach(e => {
      entries.push({
        ...e,
        type: 'journal',
        sortDate: new Date(e.date),
      });
    });

    moodLog.forEach(e => {
      entries.push({
        ...e,
        id: 'mood_' + e.dateKey,
        type: 'mood',
        sortDate: new Date(e.date),
      });
    });

    // Add morning/evening entries
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('stoic_morning_') || key.startsWith('stoic_evening_')) {
        const dateKey = key.replace('stoic_morning_', '').replace('stoic_evening_', '');
        const isMorning = key.includes('morning');
        try {
          const data = JSON.parse(localStorage.getItem(key));
          const texts = Object.values(data).filter(v => v && typeof v === 'string' && v.trim());
          if (texts.length > 0) {
            entries.push({
              id: key,
              type: isMorning ? 'morning' : 'evening',
              date: dateKey + (isMorning ? 'T08:00:00' : 'T20:00:00'),
              dateKey,
              text: texts.join(' | '),
              sortDate: new Date(dateKey + (isMorning ? 'T08:00:00' : 'T20:00:00')),
            });
          }
        } catch {}
      }
    }

    return entries
      .sort((a, b) => b.sortDate - a.sortDate)
      .filter(e => {
        if (search) {
          const searchLower = search.toLowerCase();
          const text = (e.text || '').toLowerCase();
          const note = (e.note || '').toLowerCase();
          const cat = (e.categoryName || '').toLowerCase();
          if (!text.includes(searchLower) && !note.includes(searchLower) && !cat.includes(searchLower)) {
            return false;
          }
        }
        if (filterCategory !== 'all') {
          if (e.type === 'journal' && e.category !== filterCategory) return false;
          if (e.type !== 'journal' && filterCategory !== 'all') return false;
        }
        return true;
      });
  }, [journalEntries, moodLog, search, filterCategory]);

  const getTypeLabel = (type) => {
    switch (type) {
      case 'journal': return '📝 Journal';
      case 'mood': return '😊 Mood';
      case 'morning': return '☀️ Morning';
      case 'evening': return '🌙 Evening';
      default: return type;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'journal': return 'var(--color-primary)';
      case 'mood': return '#f59e0b';
      case 'morning': return '#f97316';
      case 'evening': return '#6366f1';
      default: return 'var(--color-text-secondary)';
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Journey</h1>
        <p>Your complete history — search, reflect, and see your growth</p>
      </div>

      {/* Search & Filter */}
      <div className="card mb-24" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--color-text-secondary)' }} />
          <input
            placeholder="Search your entries..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', paddingLeft: 40 }}
          />
        </div>
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          style={{ padding: '10px 14px' }}
        >
          <option value="all">All Types</option>
          {journalCategories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="text-sm text-secondary mb-16">
        {allEntries.length} entries found
      </div>

      {/* Entries */}
      {allEntries.length === 0 ? (
        <div className="card empty-state">
          <BookOpen size={48} />
          <p className="mt-16">No entries yet. Start journaling to see your journey here.</p>
        </div>
      ) : (
        allEntries.map(entry => (
          <div
            key={entry.id}
            className="card entry-item mb-8"
            onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
          >
            <div className="flex-between">
              <div className="entry-date">
                <Calendar size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                {format(new Date(entry.date), 'EEEE, MMMM d, yyyy — h:mm a')}
              </div>
              <span className="tag" style={{ background: getTypeColor(entry.type) + '20', color: getTypeColor(entry.type), cursor: 'default' }}>
                {getTypeLabel(entry.type)}
              </span>
            </div>

            {entry.type === 'mood' ? (
              <div style={{ marginTop: 8 }}>
                <span style={{ fontSize: '1.5rem' }}>
                  {moodEmojis.find(m => m.value === entry.mood)?.emoji}
                </span>
                {entry.emotions?.length > 0 && (
                  <div className="tags-wrap mt-8">
                    {entry.emotions.map(em => (
                      <span key={em} className="tag" style={{ cursor: 'default' }}>{em}</span>
                    ))}
                  </div>
                )}
                {entry.note && <div className="mt-8 text-sm" style={{ fontStyle: 'italic' }}>{entry.note}</div>}
              </div>
            ) : (
              <div className={expandedId === entry.id ? '' : 'entry-preview'} style={{ marginTop: 8 }}>
                {entry.text}
              </div>
            )}

            {entry.type === 'journal' && (
              <div className="entry-meta">
                {entry.categoryName && <span>{entry.categoryName}</span>}
                {entry.wordCount && <span>{entry.wordCount} words</span>}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
