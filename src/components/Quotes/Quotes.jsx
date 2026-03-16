import { useState, useEffect } from 'react';
import { RefreshCw, Heart, Copy, Check } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { stoicQuotes, affirmations } from '../../data/prompts';

export default function Quotes() {
  const [tab, setTab] = useState('quotes');
  const [quoteIndex, setQuoteIndex] = useState(() => Math.floor(Math.random() * stoicQuotes.length));
  const [affirmIndex, setAffirmIndex] = useState(() => Math.floor(Math.random() * affirmations.length));
  const [favorites, setFavorites] = useLocalStorage('favorite_quotes', []);
  const [copied, setCopied] = useState(false);

  const quote = stoicQuotes[quoteIndex];
  const affirmation = affirmations[affirmIndex];

  const nextQuote = () => {
    setQuoteIndex((quoteIndex + 1) % stoicQuotes.length);
  };

  const nextAffirmation = () => {
    setAffirmIndex((affirmIndex + 1) % affirmations.length);
  };

  const toggleFavorite = (text) => {
    if (favorites.includes(text)) {
      setFavorites(favorites.filter(f => f !== text));
    } else {
      setFavorites([...favorites, text]);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Quotes & Affirmations</h1>
        <p>Wisdom from the Stoics and positive affirmations</p>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'quotes' ? 'active' : ''}`} onClick={() => setTab('quotes')}>Stoic Quotes</button>
        <button className={`tab ${tab === 'affirmations' ? 'active' : ''}`} onClick={() => setTab('affirmations')}>Affirmations</button>
        <button className={`tab ${tab === 'favorites' ? 'active' : ''}`} onClick={() => setTab('favorites')}>
          Favorites ({favorites.length})
        </button>
      </div>

      {tab === 'quotes' && (
        <>
          <div className="card quote-card mb-24">
            <div className="quote-text">"{quote.text}"</div>
            <div className="quote-author">- {quote.author}</div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
              <button className="btn btn-outline btn-sm" onClick={nextQuote}>
                <RefreshCw size={16} /> Next
              </button>
              <button
                className={`btn btn-sm ${favorites.includes(quote.text) ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => toggleFavorite(quote.text)}
              >
                <Heart size={16} fill={favorites.includes(quote.text) ? 'currentColor' : 'none'} />
              </button>
              <button className="btn btn-outline btn-sm" onClick={() => copyToClipboard(`"${quote.text}" - ${quote.author}`)}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-title mb-16">All Quotes</div>
            {stoicQuotes.map((q, i) => (
              <div key={i} className="entry-item" style={{ borderBottom: '1px solid var(--color-primary-alpha)', cursor: 'default' }}>
                <div style={{ fontStyle: 'italic', marginBottom: 4 }}>"{q.text}"</div>
                <div className="text-sm text-primary">- {q.author}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'affirmations' && (
        <div className="card quote-card">
          <div style={{ fontSize: '1.5rem', fontWeight: 300, lineHeight: 1.8, marginBottom: 24 }}>
            {affirmation}
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn btn-outline btn-sm" onClick={nextAffirmation}>
              <RefreshCw size={16} /> Next
            </button>
            <button
              className={`btn btn-sm ${favorites.includes(affirmation) ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => toggleFavorite(affirmation)}
            >
              <Heart size={16} fill={favorites.includes(affirmation) ? 'currentColor' : 'none'} />
            </button>
          </div>
          <div className="divider" />
          <div style={{ textAlign: 'left' }}>
            {affirmations.map((a, i) => (
              <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid var(--color-primary-alpha)' }}>
                {a}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'favorites' && (
        <div className="card">
          {favorites.length === 0 ? (
            <div className="empty-state">
              <Heart size={48} />
              <p>No favorites yet. Heart a quote or affirmation to save it here.</p>
            </div>
          ) : (
            favorites.map((fav, i) => (
              <div key={i} className="entry-item" style={{ borderBottom: '1px solid var(--color-primary-alpha)', display: 'flex', alignItems: 'center' }}>
                <div style={{ flex: 1, fontStyle: 'italic' }}>{fav}</div>
                <button className="btn btn-sm btn-outline" onClick={() => toggleFavorite(fav)}>
                  <Heart size={14} fill="currentColor" />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
