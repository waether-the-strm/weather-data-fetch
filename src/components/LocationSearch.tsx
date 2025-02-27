import React, { useState, useEffect } from 'react';
import { parseCoordinates } from '../utils/coordinates';
import './LocationSearch.css';

interface Location {
  id: string;
  name: string;
  coordinates: {
    lat: number;
    lon: number;
  };
}

interface LocationSearchProps {
  onLocationSelect: (location: Location) => void;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({ onLocationSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Location[]>([]);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setError(null);

    if (query.length < 2) {
      setResults([]);
      return;
    }

    // Try to parse as coordinates first
    const coordinates = parseCoordinates(query);
    if (coordinates) {
      const location: Location = {
        id: `${coordinates.lat},${coordinates.lon}`,
        name: `${coordinates.lat}, ${coordinates.lon}`,
        coordinates,
      };
      setResults([location]);
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement location name search using weather API
      // For now, just show a placeholder result
      if (query.length > 2) {
        setResults([
          {
            id: 'placeholder',
            name: query,
            coordinates: { lat: 0, lon: 0 },
          },
        ]);
      }
    } catch (err) {
      setError('Wystąpił błąd podczas wyszukiwania lokalizacji');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="location-search">
      <div className="search-input-container">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Wpisz nazwę miejscowości lub współrzędne (np. 52.229676, 21.012229)"
          className="search-input"
        />
        {isLoading && <div className="loading-indicator">Ładowanie...</div>}
      </div>

      {error && <div className="error-message">{error}</div>}

      {results.length > 0 && (
        <ul className="search-results">
          {results.map((location) => (
            <li
              key={location.id}
              onClick={() => onLocationSelect(location)}
              className="search-result-item"
            >
              {location.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
