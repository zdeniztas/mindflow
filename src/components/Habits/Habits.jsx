import { useState } from 'react';
import { format, subDays, differenceInCalendarDays } from 'date-fns';
import { Plus, Trash2, Check, Trophy } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { getToday, generateId } from '../../utils/storage';
import { defaultHabits, badges } from '../../data/prompts';

export default function Habits() {
  const today = getToday();
  const [habits, setHabits] = useLocalStorage('habits', defaultHabits);
  const [habitLog, setHabitLog] = useLocalStorage('habit_log', {});
  const [newHabit, setNewHabit] = useState('');
  const [tab, setTab] = useState('today');

  const todayLog = habitLog[today] || {};

  const toggleHabit = (habitId) => {
    const updated = { ...todayLog, [habitId]: !todayLog[habitId] };
    setHabitLog({ ...habitLog, [today]: updated });
  };

  const addHabit = () => {
    if (!newHabit.trim()) return;
    setHabits([...habits, { id: generateId(), name: newHabit.trim(), icon: '✨' }]);
    setNewHabit('');
  };

  const removeHabit = (id) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const completedToday = habits.filter(h => todayLog[h.id]).length;
  const totalHabits = habits.length;

  // Calculate streak
  const getStreak = () => {
    let streak = 0;
    let d = new Date();
    // Check if today is complete
    const todayKey = d.toISOString().split('T')[0];
    const todayDone = habitLog[todayKey] && habits.every(h => habitLog[todayKey][h.id]);
    if (!todayDone) {
      d = subDays(d, 1);
    }
    while (true) {
      const key = d.toISOString().split('T')[0];
      const log = habitLog[key];
      if (log && habits.every(h => log[h.id])) {
        streak++;
        d = subDays(d, 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const streak = getStreak();

  // Last 7 days for each habit
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), 6 - i);
    return { date: d, key: d.toISOString().split('T')[0] };
  });

  // Earned badges
  const earnedBadges = new Set();
  const journalEntries = JSON.parse(localStorage.getItem('stoic_journal_entries') || '[]');
  if (journalEntries.length >= 1) earnedBadges.add('first_entry');
  if (journalEntries.length >= 50) earnedBadges.add('entries_50');

  // Journal streak
  const getJournalStreak = () => {
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
  const jStreak = getJournalStreak();
  if (jStreak >= 3) earnedBadges.add('streak_3');
  if (jStreak >= 7) earnedBadges.add('streak_7');
  if (jStreak >= 30) earnedBadges.add('streak_30');
  if (jStreak >= 100) earnedBadges.add('streak_100');

  const moodLog = JSON.parse(localStorage.getItem('stoic_mood_log') || '[]');
  if (moodLog.length >= 7) earnedBadges.add('moods_7');

  if (streak >= 7) earnedBadges.add('habits_7');

  const breathCount = parseInt(localStorage.getItem('stoic_breathing_count') || '0');
  if (breathCount >= 10) earnedBadges.add('breathe_10');

  const meditateCount = parseInt(localStorage.getItem('stoic_meditation_count') || '0');
  if (meditateCount >= 10) earnedBadges.add('meditate_10');

  const usedCategories = new Set(journalEntries.map(e => e.category));
  if (usedCategories.size >= 8) earnedBadges.add('all_categories');

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Habits & Streaks</h1>
        <p>Build consistency, one day at a time</p>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'today' ? 'active' : ''}`} onClick={() => setTab('today')}>Today</button>
        <button className={`tab ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}>History</button>
        <button className={`tab ${tab === 'badges' ? 'active' : ''}`} onClick={() => setTab('badges')}>Badges</button>
      </div>

      {tab === 'today' && (
        <>
          {/* Stats */}
          <div className="grid-3 mb-24">
            <div className="card stat-card">
              <div className="stat-value">{completedToday}/{totalHabits}</div>
              <div className="stat-label">Completed Today</div>
            </div>
            <div className="card stat-card">
              <div className="streak-display" style={{ justifyContent: 'center' }}>
                <span className="streak-fire">🔥</span>
                <span>{streak}</span>
              </div>
              <div className="stat-label">Day Streak</div>
            </div>
            <div className="card stat-card">
              <div className="stat-value">{Math.round((completedToday / Math.max(totalHabits, 1)) * 100)}%</div>
              <div className="stat-label">Completion Rate</div>
            </div>
          </div>

          {/* Progress */}
          <div className="card mb-24">
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${totalHabits ? (completedToday / totalHabits) * 100 : 0}%` }} />
            </div>
          </div>

          {/* Habits List */}
          <div className="card mb-24">
            {habits.map(habit => (
              <div key={habit.id} className="habit-row">
                <button
                  className={`checkbox ${todayLog[habit.id] ? 'checked' : ''}`}
                  onClick={() => toggleHabit(habit.id)}
                >
                  {todayLog[habit.id] && <Check size={14} color="white" />}
                </button>
                <span className="habit-icon">{habit.icon}</span>
                <span className={`habit-name ${todayLog[habit.id] ? 'text-secondary' : ''}`}
                  style={todayLog[habit.id] ? { textDecoration: 'line-through' } : {}}>
                  {habit.name}
                </span>
                <button className="btn-icon" onClick={() => removeHabit(habit.id)}
                  style={{ color: 'var(--color-text-secondary)' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <div className="divider" />
            <div className="todo-input-row">
              <input
                placeholder="Add a new habit..."
                value={newHabit}
                onChange={e => setNewHabit(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addHabit()}
              />
              <button className="btn btn-primary" onClick={addHabit}>
                <Plus size={18} />
              </button>
            </div>
          </div>
        </>
      )}

      {tab === 'history' && (
        <div className="card">
          <div className="card-title mb-16">7-Day Overview</div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: 8, color: 'var(--color-text-secondary)' }}>Habit</th>
                  {last7.map(d => (
                    <th key={d.key} style={{ padding: 8, color: 'var(--color-text-secondary)', textAlign: 'center' }}>
                      {format(d.date, 'EEE')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {habits.map(habit => (
                  <tr key={habit.id}>
                    <td style={{ padding: 8 }}>{habit.icon} {habit.name}</td>
                    {last7.map(d => {
                      const done = habitLog[d.key]?.[habit.id];
                      return (
                        <td key={d.key} style={{ textAlign: 'center', padding: 8 }}>
                          <span style={{
                            display: 'inline-block', width: 24, height: 24, borderRadius: 6,
                            background: done ? 'var(--color-primary)' : 'var(--color-primary-alpha)',
                            lineHeight: '24px', fontSize: '0.7rem', color: done ? 'white' : 'var(--color-text-secondary)'
                          }}>
                            {done ? '✓' : ''}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'badges' && (
        <div className="grid-3">
          {badges.map(badge => (
            <div key={badge.id} className="card badge-card">
              <div className={`badge-icon ${earnedBadges.has(badge.id) ? 'earned' : ''}`}>{badge.icon}</div>
              <div className="badge-name">{badge.name}</div>
              <div className="badge-desc">{badge.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
