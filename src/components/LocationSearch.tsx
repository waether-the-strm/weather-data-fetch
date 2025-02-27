import React, { useState } from 'react';
import { parseCoordinates } from '../utils/coordinates';
import { searchLocation, checkWeatherAvailability } from '../services/weatherService';
import { LocationSearchResult } from '../types/weather';
import './LocationSearch.css';

interface LocationSearchProps {
  onLocationSelect: (location: LocationSearchResult) => void;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({ onLocationSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<LocationSearchResult[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setError(null);

    // Try to parse as coordinates immediately
    const coordinates = parseCoordinates(query);
    if (coordinates) {
      const location: LocationSearchResult = {
        id: `${coordinates.lat},${coordinates.lon}`,
        name: `${coordinates.lat}, ${coordinates.lon}`,
        country: '',
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
        const isAvailable = await checkWeatherAvailability(coordinates);
        if (!isAvailable) {
          setError('No weather data available for these coordinates');
          setResults([]);
          return;
        }

        const location: LocationSearchResult = {
          id: `${coordinates.lat},${coordinates.lon}`,
          name: `${coordinates.lat}, ${coordinates.lon}`,
          country: '',
          coordinates,
        };
        setResults([location]);
        return;
      }

      // Search for location by name
      const locations = await searchLocation(searchQuery);
      if (locations.length === 0) {
        setError('No locations found');
        return;
      }

      // Check weather availability for each location
      const availableLocations = await Promise.all(
        locations.map(async (location) => {
          const isAvailable = await checkWeatherAvailability(location.coordinates);
          return isAvailable ? location : null;
        })
      );

      const filteredLocations = availableLocations.filter(
        (loc): loc is LocationSearchResult => loc !== null
      );

      if (filteredLocations.length === 0) {
        setError('No weather data available for found locations');
        return;
      }

      setResults(filteredLocations);
    } catch (err) {
      setError('Error occurred while searching for location');
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
          placeholder="Enter city name or coordinates (e.g. 52.229676, 21.012229)"
          className="search-input"
          disabled={isLoading}
        />
        <button
          className="search-button"
          onClick={handleSearch}
          disabled={isLoading || searchQuery.length < 2}
        >
          {isLoading ? <span className="loader"></span> : 'Search'}
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
              <svg
                className="location-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="location-name">
                {location.name}
                {location.country && ` (${location.country})`}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
