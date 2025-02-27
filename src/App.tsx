import { useState } from 'react';
import { LocationSearch } from './components/LocationSearch';
import { DateRangeSelector } from './components/DateRangeSelector';
import { LocationSearchResult } from './types/weather';
import './App.css';

interface DateRange {
  startDate: Date;
  endDate: Date;
}

function App() {
  const [selectedLocation, setSelectedLocation] = useState<LocationSearchResult | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);
    return {
      startDate: lastWeek,
      endDate: today,
    };
  });

  const handleLocationSelect = (location: LocationSearchResult) => {
    setSelectedLocation(location);
  };

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
  };

  return (
    <div className="app">
      <header>
        <h1>Weather Data Fetch</h1>
      </header>
      <main>
        <section className="search-section">
          <h2>Wybierz lokalizację</h2>
          <LocationSearch onLocationSelect={handleLocationSelect} />
          {selectedLocation && (
            <div className="selected-location">
              <h3>Wybrana lokalizacja:</h3>
              <p>
                {selectedLocation.name}
                {selectedLocation.country && ` (${selectedLocation.country})`}
              </p>
              <p className="coordinates">
                {selectedLocation.coordinates.lat.toFixed(6)},{' '}
                {selectedLocation.coordinates.lon.toFixed(6)}
              </p>
              <DateRangeSelector onChange={handleDateRangeChange} />
              <button
                className="fetch-data-button"
                onClick={() =>
                  console.log('Pobieranie danych dla:', { selectedLocation, dateRange })
                }
              >
                Pobierz dane pogodowe
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
