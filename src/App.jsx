import { useState } from 'react';
import { HashRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { Home as HomeIcon, BookOpen, Smile, CheckSquare, Wind, Brain, Quote, TrendingUp, Settings as SettingsIcon, Clock, Menu, X } from 'lucide-react';
import { useTheme } from './hooks/useTheme';
import { useLocalStorage } from './hooks/useLocalStorage';
import Home from './components/Home/Home';
import Journal from './components/Journal/Journal';
import MoodTracker from './components/MoodTracker/MoodTracker';
import Habits from './components/Habits/Habits';
import Breathing from './components/Breathing/Breathing';
import Meditation from './components/Meditation/Meditation';
import Quotes from './components/Quotes/Quotes';
import Trends from './components/Trends/Trends';
import Settings from './components/Settings/Settings';
import Journey from './components/Journey/Journey';
import LockScreen from './components/common/LockScreen';
import './index.css';

const navItems = [
  { path: '/', icon: HomeIcon, label: 'Home' },
  { path: '/journal', icon: BookOpen, label: 'Journal' },
  { path: '/mood', icon: Smile, label: 'Mood' },
  { path: '/habits', icon: CheckSquare, label: 'Habits' },
  { path: '/breathing', icon: Wind, label: 'Breathing' },
  { path: '/meditation', icon: Brain, label: 'Meditation' },
  { path: '/quotes', icon: Quote, label: 'Quotes' },
  { path: '/trends', icon: TrendingUp, label: 'Trends' },
  { path: '/journey', icon: Clock, label: 'Journey' },
  { path: '/settings', icon: SettingsIcon, label: 'Settings' },
];

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="app-layout">
      <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />

      <div className="mobile-header">
        <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="logo">Mindflow</div>
        <div style={{ width: 40 }} />
      </div>

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <span>&#x1F9D8;</span> Mindflow
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
              end={item.path === '/'}
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="text-sm text-secondary">Your personal space</div>
        </div>
      </aside>

      <main className="main-content fade-in" key={location.pathname}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/mood" element={<MoodTracker />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/breathing" element={<Breathing />} />
          <Route path="/meditation" element={<Meditation />} />
          <Route path="/quotes" element={<Quotes />} />
          <Route path="/trends" element={<Trends />} />
          <Route path="/journey" element={<Journey />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  useTheme();
  const [password] = useLocalStorage('password', '');
  const [unlocked, setUnlocked] = useState(!password);

  if (password && !unlocked) {
    return <LockScreen password={password} onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

export default App;
