import React, { useState, useEffect, useMemo } from 'react'
import { getRandomUser } from '../components/api'
import { useLocalStorage } from '../components/useLocalStorage'
import { exportAsJSON, exportAsCSV, userId } from '../components/exportUtils'
import FilterPanel from '../components/FilterPanel'
import UserGrid from '../components/UserGrid'
import './App.css'

const DEFAULT_FILTERS = {
  gender: 'all',
  nat: '',
  results: 8,
  seed: '',
  search: '',
  sortBy: 'none',
};

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  // Persisted state: saved favorite users and the chosen theme.
  const [favorites, setFavorites] = useLocalStorage('ru_favorites', []);
  const [showFavorites, setShowFavorites] = useState(false);
  const [theme, setTheme] = useLocalStorage('ru_theme', 'dark');

  // Fetch a batch of users using the current API-related filters.
  const loadUsers = () => {
    setLoading(true);
    setError('');
    getRandomUser({
      results: filters.results,
      gender: filters.gender,
      nat: filters.nat,
      seed: filters.seed,
    })
      .then((data) => setUsers(data.results))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  // Initial load on mount.
  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply the chosen theme to the document root.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleFavorite = (user) => {
    const id = userId(user);
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  // The pool we display: either the fetched batch or saved favorites.
  const favoriteUsers = useMemo(
    () => users.filter((u) => favorites.includes(userId(u))),
    [users, favorites]
  );
  const pool = showFavorites ? favoriteUsers : users;

  // Client-side search + sort over the current pool.
  const visibleUsers = useMemo(() => {
    const term = filters.search.trim().toLowerCase();
    let list = pool.filter((u) => {
      if (!term) return true;
      const haystack = `${u.name.first} ${u.name.last} ${u.email} ${u.location.country}`.toLowerCase();
      return haystack.includes(term);
    });

    const sorters = {
      name: (a, b) => a.name.first.localeCompare(b.name.first),
      age: (a, b) => a.dob.age - b.dob.age,
      country: (a, b) => a.location.country.localeCompare(b.location.country),
    };
    if (sorters[filters.sortBy]) list = [...list].sort(sorters[filters.sortBy]);
    return list;
  }, [pool, filters.search, filters.sortBy]);

  return (
    <div className="App">
      <header className="app-header">
        <h1>🎲 Random User Explorer</h1>
        <button
          className="theme-toggle"
          onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
      </header>

      <FilterPanel
        filters={filters}
        onChange={setFilters}
        onGenerate={loadUsers}
        loading={loading}
      />

      <div className="toolbar">
        <button
          className={showFavorites ? 'active' : ''}
          onClick={() => setShowFavorites((v) => !v)}
        >
          {showFavorites ? 'Show All' : `Favorites (${favorites.length})`}
        </button>
        <span className="count">{visibleUsers.length} shown</span>
        <div className="export-group">
          <button onClick={() => exportAsJSON(visibleUsers)} disabled={!visibleUsers.length}>
            Export JSON
          </button>
          <button onClick={() => exportAsCSV(visibleUsers)} disabled={!visibleUsers.length}>
            Export CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          ⚠️ {error} <button onClick={loadUsers}>Retry</button>
        </div>
      )}

      <UserGrid
        users={visibleUsers}
        loading={loading}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
}

export default App;
