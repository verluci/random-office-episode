import { useState } from 'react'
import episodesData from './data/episodes.json'
import { Coffee, Filter, RefreshCw } from 'lucide-react'

function App() {
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [filters, setFilters] = useState({
    onlyMichael: false,
    christmas: true,
    halloween: true,
    valentines: true
  });

  const handleFilterChange = (e) => {
    const { name, checked } = e.target;
    setFilters(prev => ({ ...prev, [name]: checked }));
  };

  const selectRandomEpisode = () => {
    let filtered = episodesData;

    if (filters.onlyMichael) {
      filtered = filtered.filter(ep => ep.hasMichael);
    }

    // Seasonal exclusion filters
    if (!filters.christmas) {
      filtered = filtered.filter(ep => ep.seasonal !== 'Christmas');
    }
    if (!filters.halloween) {
      filtered = filtered.filter(ep => ep.seasonal !== 'Halloween');
    }
    if (!filters.valentines) {
      filtered = filtered.filter(ep => ep.seasonal !== 'Valentine\'s Day');
    }

    if (filtered.length === 0) {
      setSelectedEpisode("No episodes found matching these filters!");
      return;
    }

    const randomIndex = Math.floor(Math.random() * filtered.length);
    setSelectedEpisode(filtered[randomIndex]);
  };

  return (
    <div className="app-container">
      <div className="coffee-stain"></div>

      <header>
        <h1>Dunder Mifflin</h1>
        <div className="logo-subtext">PAPER COMPANY, INC.</div>
        <p style={{ marginTop: '20px', fontStyle: 'italic' }}>Episode Randomizer 1.0 (Internal Use Only)</p>
      </header>

      <div className="filters">
        <label className="filter-item">
          <input
            type="checkbox"
            name="onlyMichael"
            checked={filters.onlyMichael}
            onChange={handleFilterChange}
          />
          Include Michael Scott only
        </label>

        <div style={{ marginTop: '10px', fontWeight: 'bold', fontSize: '0.9rem' }}>Seasonal Overrides:</div>
        <div className="seasonal-filters">
          <label className="filter-item">
            <input
              type="checkbox"
              name="christmas"
              checked={filters.christmas}
              onChange={handleFilterChange}
            />
            Christmas
          </label>
          <label className="filter-item">
            <input
              type="checkbox"
              name="halloween"
              checked={filters.halloween}
              onChange={handleFilterChange}
            />
            Halloween
          </label>
          <label className="filter-item">
            <input
              type="checkbox"
              name="valentines"
              checked={filters.valentines}
              onChange={handleFilterChange}
            />
            Valentine's
          </label>
        </div>
      </div>

      <div className="action-section">
        <button className="select-button" onClick={selectRandomEpisode}>
          SELECT RANDOM EPISODE
        </button>
      </div>

      {selectedEpisode ? (
        typeof selectedEpisode === 'string' ? (
          <div className="empty-state">{selectedEpisode}</div>
        ) : (
          <div className="result-card">
            <h2>{selectedEpisode.title}</h2>
            <div className="result-meta">
              Season {selectedEpisode.season}, Episode {selectedEpisode.episode}
              {selectedEpisode.seasonal && <span style={{ marginLeft: '10px', color: '#e67e22' }}>[{selectedEpisode.seasonal} Special]</span>}
            </div>
            <p>Ready to watch? Head over to your favorite streaming service!</p>
          </div>
        )
      ) : (
        <div className="empty-state">No episode selected. Click the button to start.</div>
      )}

      <footer style={{ marginTop: '40px', textAlign: 'center', fontSize: '0.7rem', color: '#aaa', borderTop: '1px solid #eee', paddingTop: '20px' }}>
        &copy; 2026 Dunder Mifflin Paper Company, Inc. Scranton Branch.
      </footer>
    </div>
  )
}

export default App
