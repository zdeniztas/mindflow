import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Square } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { breathingExercises } from '../../data/prompts';

export default function Breathing() {
  const [selected, setSelected] = useState(null);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState(''); // inhale, hold1, exhale, hold2
  const [timeLeft, setTimeLeft] = useState(0);
  const [round, setRound] = useState(0);
  const [totalRounds, setTotalRounds] = useState(0);
  const [breathCount, setBreathCount] = useLocalStorage('breathing_count', 0);
  const timerRef = useRef(null);
  const phaseRef = useRef({ phase: '', timeLeft: 0, round: 0 });

  const exercise = selected ? breathingExercises.find(e => e.id === selected) : null;

  const getPhases = useCallback(() => {
    if (!exercise) return [];
    const phases = [];
    if (exercise.inhale > 0) phases.push({ name: 'Inhale', duration: exercise.inhale });
    if (exercise.hold1 > 0) phases.push({ name: 'Hold', duration: exercise.hold1 });
    if (exercise.exhale > 0) phases.push({ name: 'Exhale', duration: exercise.exhale });
    if (exercise.hold2 > 0) phases.push({ name: 'Hold', duration: exercise.hold2 });
    return phases;
  }, [exercise]);

  const startExercise = () => {
    if (!exercise) return;
    const phases = getPhases();
    setRunning(true);
    setRound(1);
    setTotalRounds(exercise.rounds);
    setPhase(phases[0].name);
    setTimeLeft(phases[0].duration);
    phaseRef.current = { phaseIndex: 0, round: 1 };
  };

  const stopExercise = () => {
    setRunning(false);
    setPhase('');
    setTimeLeft(0);
    setRound(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    if (!running || !exercise) return;

    const phases = getPhases();

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0.1) {
          // Move to next phase
          let nextIndex = phaseRef.current.phaseIndex + 1;
          let nextRound = phaseRef.current.round;

          if (nextIndex >= phases.length) {
            nextIndex = 0;
            nextRound++;
          }

          if (nextRound > exercise.rounds) {
            // Done
            setRunning(false);
            setPhase('Complete!');
            setBreathCount(c => c + 1);
            clearInterval(timerRef.current);
            return 0;
          }

          phaseRef.current = { phaseIndex: nextIndex, round: nextRound };
          setPhase(phases[nextIndex].name);
          setRound(nextRound);
          return phases[nextIndex].duration;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => clearInterval(timerRef.current);
  }, [running, exercise, getPhases, setBreathCount]);

  const getCircleClass = () => {
    if (phase === 'Inhale') return 'inhale';
    if (phase === 'Hold') return 'hold';
    if (phase === 'Exhale') return 'exhale';
    return '';
  };

  if (running || phase === 'Complete!') {
    return (
      <div className="fade-in">
        <div className="breathing-container">
          <div className="text-sm text-secondary mb-16">{exercise?.name}</div>
          <div className={`breathing-circle ${getCircleClass()}`}>
            <div style={{ textAlign: 'center' }}>
              <div>{phase}</div>
              {phase !== 'Complete!' && (
                <div style={{ fontSize: '2rem', marginTop: 4 }}>{Math.ceil(timeLeft)}</div>
              )}
            </div>
          </div>
          {phase !== 'Complete!' && (
            <div className="text-secondary mt-24">Round {round} of {totalRounds}</div>
          )}
          <div className="mt-24">
            {phase === 'Complete!' ? (
              <button className="btn btn-primary" onClick={() => { setPhase(''); setSelected(null); }}>
                Done
              </button>
            ) : (
              <button className="btn btn-outline" onClick={stopExercise}>
                <Square size={18} /> Stop
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Breathing</h1>
        <p>Science-backed exercises to help you relax, focus, and sleep better</p>
      </div>

      <div className="text-sm text-secondary mb-24">
        Sessions completed: {breathCount}
      </div>

      <div className="grid-2">
        {breathingExercises.map(ex => (
          <div
            key={ex.id}
            className={`card category-card ${selected === ex.id ? 'selected' : ''}`}
            onClick={() => setSelected(ex.id)}
            style={selected === ex.id ? { borderColor: 'var(--color-primary)' } : {}}
          >
            <div style={{ flex: 1 }}>
              <h3 style={{ fontWeight: 600, marginBottom: 4 }}>{ex.name}</h3>
              <p className="text-sm text-secondary">{ex.description}</p>
              <div className="text-sm mt-8" style={{ color: 'var(--color-primary)' }}>
                {ex.benefit}
              </div>
              <div className="text-sm text-secondary mt-8">
                {ex.inhale}s in{ex.hold1 ? ` / ${ex.hold1}s hold` : ''} / {ex.exhale}s out{ex.hold2 ? ` / ${ex.hold2}s hold` : ''} — {ex.rounds} rounds
              </div>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="text-center mt-24">
          <button className="btn btn-primary" onClick={startExercise}>
            <Play size={18} /> Start Breathing
          </button>
        </div>
      )}
    </div>
  );
}
