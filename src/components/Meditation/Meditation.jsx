import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const durations = [1, 3, 5, 10, 15, 20, 30];
const ambientSounds = [
  { id: 'none', name: 'Silence', emoji: '🔇' },
  { id: 'rain', name: 'Rain', emoji: '🌧️' },
  { id: 'ocean', name: 'Ocean', emoji: '🌊' },
  { id: 'forest', name: 'Forest', emoji: '🌲' },
  { id: 'wind', name: 'Wind', emoji: '💨' },
];

export default function Meditation() {
  const [duration, setDuration] = useState(5);
  const [sound, setSound] = useState('none');
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [meditationCount, setMeditationCount] = useLocalStorage('meditation_count', 0);
  const [totalMinutes, setTotalMinutes] = useLocalStorage('meditation_minutes', 0);
  const intervalRef = useRef(null);

  const totalSeconds = duration * 60;

  const start = () => {
    setRunning(true);
    setPaused(false);
    setSecondsLeft(totalSeconds);
  };

  const togglePause = () => {
    setPaused(!paused);
  };

  const stop = () => {
    setRunning(false);
    setPaused(false);
    setSecondsLeft(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const reset = () => {
    setSecondsLeft(totalSeconds);
    setPaused(false);
  };

  useEffect(() => {
    if (running && !paused && secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            setRunning(false);
            setMeditationCount(c => c + 1);
            setTotalMinutes(m => m + duration);
            clearInterval(intervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, paused, secondsLeft, duration, setMeditationCount, setTotalMinutes]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const progress = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) : 0;
  const circumference = 2 * Math.PI * 122;
  const dashOffset = circumference - (progress * circumference);

  const isComplete = !running && secondsLeft === 0 && meditationCount > 0;

  if (running || (secondsLeft === 0 && !running && isComplete)) {
    return (
      <div className="fade-in">
        <div className="meditation-timer">
          {secondsLeft === 0 && !running ? (
            <>
              <div style={{ fontSize: '3rem' }}>&#x2728;</div>
              <h2>Session Complete</h2>
              <p className="text-secondary">Great job! You meditated for {duration} minutes.</p>
              <button className="btn btn-primary" onClick={() => setSecondsLeft(-1)}>
                Done
              </button>
            </>
          ) : (
            <>
              <div className="text-sm text-secondary">{duration} minute session</div>
              <div className="timer-ring">
                <svg viewBox="0 0 256 256">
                  <circle cx="128" cy="128" r="122"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    style={{ opacity: 0.3 }}
                  />
                  <circle cx="128" cy="128" r="122"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                  />
                </svg>
                <div className="timer-display">{formatTime(secondsLeft)}</div>
              </div>

              <div style={{ display: 'flex', gap: 16 }}>
                <button className="btn btn-outline" onClick={togglePause}>
                  {paused ? <Play size={18} /> : <Pause size={18} />}
                  {paused ? 'Resume' : 'Pause'}
                </button>
                <button className="btn btn-outline" onClick={reset}>
                  <RotateCcw size={18} /> Reset
                </button>
                <button className="btn btn-danger" onClick={stop}>
                  <Square size={18} /> Stop
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Meditation</h1>
        <p>Unguided meditation sessions to quiet your mind</p>
      </div>

      <div className="grid-3 mb-24">
        <div className="card stat-card">
          <div className="stat-value">{meditationCount}</div>
          <div className="stat-label">Sessions</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">{totalMinutes}</div>
          <div className="stat-label">Total Minutes</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">{Math.round(totalMinutes / Math.max(meditationCount, 1))}</div>
          <div className="stat-label">Avg. Minutes</div>
        </div>
      </div>

      <div className="card mb-24">
        <div className="card-title mb-16">Duration</div>
        <div className="duration-options">
          {durations.map(d => (
            <button
              key={d}
              className={`duration-btn ${duration === d ? 'selected' : ''}`}
              onClick={() => setDuration(d)}
            >
              {d} min
            </button>
          ))}
        </div>
      </div>

      <div className="card mb-24">
        <div className="card-title mb-16">Ambient Sound</div>
        <div className="duration-options">
          {ambientSounds.map(s => (
            <button
              key={s.id}
              className={`duration-btn ${sound === s.id ? 'selected' : ''}`}
              onClick={() => setSound(s.id)}
            >
              {s.emoji} {s.name}
            </button>
          ))}
        </div>
        <p className="text-sm text-secondary mt-8">
          Note: Ambient sounds are visual indicators only in this version.
        </p>
      </div>

      <div className="text-center">
        <button className="btn btn-primary" onClick={start} style={{ padding: '14px 40px', fontSize: '1rem' }}>
          <Play size={20} /> Begin Meditation
        </button>
      </div>
    </div>
  );
}
