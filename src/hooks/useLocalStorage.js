import { useState, useCallback } from 'react';

const PREFIX = 'stoic_';

export function useLocalStorage(key, initialValue) {
  const prefixedKey = PREFIX + key;

  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(prefixedKey);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    setStoredValue(prev => {
      const newValue = value instanceof Function ? value(prev) : value;
      localStorage.setItem(prefixedKey, JSON.stringify(newValue));
      return newValue;
    });
  }, [prefixedKey]);

  return [storedValue, setValue];
}
