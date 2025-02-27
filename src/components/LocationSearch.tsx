import React, { useState } from 'react';
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
  const [results, setResults] = useState<Location[]>([]);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    // TODO: Implement actual location search with Google Maps Geocoding API
    // This is a placeholder for now
    setResults([]);
    setIsLoading(false);
  };

  return (
    <div className="location-search">
      <div className="search-input-container">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Wyszukaj lokalizację..."
          className="search-input"
        />
        {isLoading && <div className="loading-indicator">Ładowanie...</div>}
      </div>

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
