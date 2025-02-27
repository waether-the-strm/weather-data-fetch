import React, { useState } from 'react';
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setError(null);

    // Try to parse as coordinates immediately
    const coordinates = parseCoordinates(query);
    if (coordinates) {
      const location: Location = {
        id: `${coordinates.lat},${coordinates.lon}`,
        name: `${coordinates.lat}, ${coordinates.lon}`,
        coordinates,
      };
      setResults([location]);
    } else if (query.length < 2) {
      setResults([]);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.length < 2) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // If we already have coordinates result, use it
      const coordinates = parseCoordinates(searchQuery);
      if (coordinates) {
        const location: Location = {
          id: `${coordinates.lat},${coordinates.lon}`,
          name: `${coordinates.lat}, ${coordinates.lon}`,
          coordinates,
        };
        setResults([location]);
        return;
      }

      // TODO: Implement location name search using weather API
      // For now, just show a placeholder result
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Symulacja opóźnienia API
      setResults([
        {
          id: 'placeholder',
          name: searchQuery,
          coordinates: { lat: 0, lon: 0 },
        },
      ]);
    } catch (err) {
      setError('Wystąpił błąd podczas wyszukiwania lokalizacji');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="location-search">
      <div className="search-input-container">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Wpisz nazwę miejscowości lub współrzędne (np. 52.229676, 21.012229)"
          className="search-input"
          disabled={isLoading}
        />
        <button
          className="search-button"
          onClick={handleSearch}
          disabled={isLoading || searchQuery.length < 2}
        >
          {isLoading ? <span className="loader"></span> : 'Szukaj'}
        </button>
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
