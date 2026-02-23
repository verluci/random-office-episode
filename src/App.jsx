import { useState } from 'react'
import episodesData from './data/episodes.json'
import { RefreshCw, FileText, CheckSquare, Search, Star } from 'lucide-react'

function App() {
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const [filters, setFilters] = useState({
    onlyMichael: false,
    christmas: true,
    halloween: true,
    valentines: true,
    weightedShuffle: false
  });

  const handleFilterChange = (e) => {
    const { name, checked } = e.target;
    setFilters(prev => ({ ...prev, [name]: checked }));
  };

  const selectRandomEpisode = () => {
    setIsShuffling(true);
    setSelectedEpisode(null);

    // Simulate "searching files" for premium feel
    setTimeout(() => {
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
        setSelectedEpisode("No archival records match current criteria.");
        setIsShuffling(false);
        return;
      }

      if (filters.weightedShuffle) {
        // Weighted random selection based on IMDB scores
        const totalWeight = filtered.reduce((sum, ep) => sum + Math.pow(ep.imdbRating, 2), 0);
        let randomWeight = Math.random() * totalWeight;

        for (const ep of filtered) {
          randomWeight -= Math.pow(ep.imdbRating, 2);
          if (randomWeight <= 0) {
            setSelectedEpisode(ep);
            setIsShuffling(false);
            return;
          }
        }
      }

      const randomIndex = Math.floor(Math.random() * filtered.length);
      setSelectedEpisode(filtered[randomIndex]);
      setIsShuffling(false);
    }, 300);
  };

  return (
    <div className="app-container">
      <div className="coffee-stain"></div>

      <header>
        <h1>Scranton Paper Solutions</h1>
        <div className="logo-subtext">DISTRIBUTION CENTER #042</div>
        <div className="system-status">System Status: Online / Records Verified</div>
      </header>

      <div className="filters">
        <div className="filter-section-title">Personnel Filters</div>
        <label className="filter-item">
          <input
            type="checkbox"
            name="onlyMichael"
            checked={filters.onlyMichael}
            onChange={handleFilterChange}
          />
          Include Regional Manager only
        </label>

        <div className="filter-section-title">Seasonal Archive Exclusions</div>
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

        <div className="filter-section-title">Selection Mechanism</div>
        <label className="filter-item">
          <input
            type="checkbox"
            name="weightedShuffle"
            checked={filters.weightedShuffle}
            onChange={handleFilterChange}
          />
          Prioritize highest rated records
        </label>
      </div>

      <div className="action-section">
        <button
          className="select-button"
          onClick={selectRandomEpisode}
          disabled={isShuffling}
        >
          {isShuffling ? (
            <>
              <RefreshCw size={20} className="shuffling-icon" />
              SEARCHING ARCHIVES...
            </>
          ) : (
            <>
              <Search size={20} />
              RETRIEVE RANDOM RECORD
            </>
          )}
        </button>
      </div>

      <div className="result-container">
        {isShuffling ? (
          <div className="empty-state">Decrypting file path...</div>
        ) : selectedEpisode ? (
          typeof selectedEpisode === 'string' ? (
            <div className="empty-state">{selectedEpisode}</div>
          ) : (
            <div className="memo-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h2>{selectedEpisode.title}</h2>
                <FileText size={24} opacity={0.3} />
              </div>
              <div className="result-meta">
                SEASON: {selectedEpisode.season.toString().padStart(2, '0')} <br />
                RECORD: EP-{selectedEpisode.episode.toString().padStart(3, '0')}
                {selectedEpisode.seasonal && <span className="special-tag">{selectedEpisode.seasonal.toUpperCase()}</span>}
              </div>
              <div className="rating-container">
                <span className="rating-label">IMDB RATING:</span>
                <div className={`rating-badge ${selectedEpisode.imdbRating >= 9 ? 'rating-high' : selectedEpisode.imdbRating >= 8 ? 'rating-mid' : 'rating-low'}`}>
                  <Star size={14} fill="currentColor" />
                  <span>{selectedEpisode.imdbRating.toFixed(1)}</span>
                </div>
              </div>
              <p className="memo-instruction">
                Document retrieved. Authorized for viewing on primary screening device.
              </p>
            </div>
          )
        ) : (
          <div className="empty-state">Waiting for selection...</div>
        )}
      </div>

      <footer>
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>SCRANTON PAPER SOLUTIONS</div>
        <div>INTERNAL USE ONLY. REPRODUCTION PROHIBITED.</div>
      </footer>
    </div>
  )
}

export default App
