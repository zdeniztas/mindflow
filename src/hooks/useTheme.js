import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { colorThemes } from '../data/prompts';

export function useTheme() {
  const [themeId, setThemeId] = useLocalStorage('theme', 'midnight');

  const theme = colorThemes.find(t => t.id === themeId) || colorThemes[0];

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-bg', theme.bg);
    root.style.setProperty('--color-surface', theme.surface);
    root.style.setProperty('--color-text', theme.text);
    root.style.setProperty('--color-text-secondary', theme.textSecondary);
    root.style.setProperty('--color-primary-alpha', theme.primary + '20');
    root.style.setProperty('--color-primary-hover', theme.primary + 'cc');
    document.body.style.backgroundColor = theme.bg;
    document.body.style.color = theme.text;
  }, [theme]);

  return { theme, themeId, setThemeId };
}
