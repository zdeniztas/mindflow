import { useMemo } from 'react';
import { format, subDays, startOfWeek, eachDayOfInterval } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export default function Trends() {
  const [moodLog] = useLocalStorage('mood_log', []);
  const [journalEntries] = useLocalStorage('journal_entries', []);

  // Mood data for chart (last 30 days)
  const moodData = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const d = subDays(new Date(), 29 - i);
      const key = d.toISOString().split('T')[0];
      const entry = moodLog.find(e => e.dateKey === key);
      return {
        date: format(d, 'MMM d'),
        mood: entry?.mood || null,
      };
    }).filter(d => d.mood !== null);
  }, [moodLog]);

  // Journal word count data
  const wordCountData = useMemo(() => {
    const byDate = {};
    journalEntries.forEach(e => {
      if (!byDate[e.dateKey]) byDate[e.dateKey] = 0;
      byDate[e.dateKey] += e.wordCount || 0;
    });
    return Array.from({ length: 30 }, (_, i) => {
      const d = subDays(new Date(), 29 - i);
      const key = d.toISOString().split('T')[0];
      return { date: format(d, 'MMM d'), words: byDate[key] || 0 };
    });
  }, [journalEntries]);

  // Category breakdown
  const categoryData = useMemo(() => {
    const counts = {};
    journalEntries.forEach(e => {
      const cat = e.categoryName || 'Free Write';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [journalEntries]);

  // Emotion frequency
  const emotionData = useMemo(() => {
    const counts = {};
    moodLog.forEach(e => {
      (e.emotions || []).forEach(em => {
        counts[em] = (counts[em] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [moodLog]);

  // Stats
  const totalEntries = journalEntries.length;
  const totalWords = journalEntries.reduce((sum, e) => sum + (e.wordCount || 0), 0);
  const avgMood = moodLog.length > 0
    ? (moodLog.reduce((sum, e) => sum + e.mood, 0) / moodLog.length).toFixed(1)
    : '-';
  const moodEntries = moodLog.length;

  // Journal streak
  const getStreak = () => {
    let s = 0;
    let d = new Date();
    while (true) {
      const key = d.toISOString().split('T')[0];
      if (journalEntries.some(e => e.dateKey === key)) {
        s++;
        d = subDays(d, 1);
      } else break;
    }
    return s;
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Trends</h1>
        <p>Visualize your mental health journey</p>
      </div>

      {/* Overview Stats */}
      <div className="grid-4 mb-24">
        <div className="card stat-card">
          <div className="stat-value">{totalEntries}</div>
          <div className="stat-label">Journal Entries</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">{totalWords.toLocaleString()}</div>
          <div className="stat-label">Words Written</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">{avgMood}</div>
          <div className="stat-label">Avg Mood (1-5)</div>
        </div>
        <div className="card stat-card">
          <div className="streak-display" style={{ justifyContent: 'center' }}>
            <span className="streak-fire">🔥</span>
            <span>{getStreak()}</span>
          </div>
          <div className="stat-label">Day Streak</div>
        </div>
      </div>

      {/* Mood Chart */}
      <div className="card mb-24">
        <div className="card-title mb-16">Mood Over Time</div>
        {moodData.length > 0 ? (
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moodData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-primary-alpha)" />
                <XAxis dataKey="date" stroke="var(--color-text-secondary)" fontSize={12} />
                <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} stroke="var(--color-text-secondary)" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-primary-alpha)', borderRadius: 8 }}
                  labelStyle={{ color: 'var(--color-text)' }}
                />
                <Line type="monotone" dataKey="mood" stroke="var(--color-primary)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="empty-state">Start tracking your mood to see trends</div>
        )}
      </div>

      {/* Word Count Chart */}
      <div className="card mb-24">
        <div className="card-title mb-16">Words Written (Last 30 Days)</div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={wordCountData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-primary-alpha)" />
              <XAxis dataKey="date" stroke="var(--color-text-secondary)" fontSize={12} interval={4} />
              <YAxis stroke="var(--color-text-secondary)" fontSize={12} />
              <Tooltip
                contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-primary-alpha)', borderRadius: 8 }}
                labelStyle={{ color: 'var(--color-text)' }}
              />
              <Bar dataKey="words" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid-2">
        {/* Category Breakdown */}
        <div className="card">
          <div className="card-title mb-16">Journal Categories</div>
          {categoryData.length > 0 ? (
            categoryData.map(cat => (
              <div key={cat.name} className="flex-between" style={{ padding: '8px 0', borderBottom: '1px solid var(--color-primary-alpha)' }}>
                <span>{cat.name}</span>
                <span className="text-primary font-semibold">{cat.count}</span>
              </div>
            ))
          ) : (
            <div className="empty-state text-sm">No journal entries yet</div>
          )}
        </div>

        {/* Top Emotions */}
        <div className="card">
          <div className="card-title mb-16">Top Emotions</div>
          {emotionData.length > 0 ? (
            emotionData.map(em => (
              <div key={em.name} className="flex-between" style={{ padding: '8px 0', borderBottom: '1px solid var(--color-primary-alpha)' }}>
                <span>{em.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className="progress-bar" style={{ width: 80 }}>
                    <div className="progress-bar-fill" style={{ width: `${(em.count / Math.max(...emotionData.map(e => e.count))) * 100}%` }} />
                  </div>
                  <span className="text-sm text-secondary">{em.count}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state text-sm">Track moods with emotions to see data</div>
          )}
        </div>
      </div>
    </div>
  );
}
