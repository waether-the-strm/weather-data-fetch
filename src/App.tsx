import { useState } from 'react';
import { LocationSearch } from './components/LocationSearch';
import { DateRangeSelector } from './components/DateRangeSelector';
import { WeatherDataTable } from './components/WeatherDataTable';
import { WeatherCharts } from './components/WeatherCharts';
import { LocationSearchResult, WeatherAPIResponse, WeatherDataPoint } from './types/weather';
import { getWeatherData } from './services/weatherService';
import './App.css';

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface WeatherData {
  time: string;
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  precipitation: number;
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
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleLocationSelect = (location: LocationSearchResult) => {
    setSelectedLocation(location);
    setWeatherData([]);
    setError(null);
    setStatusMessage(null);
  };

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    setWeatherData([]);
    setError(null);
    setStatusMessage(null);
  };

  const handleFetchData = async () => {
    if (!selectedLocation) return;

    setIsLoading(true);
    setError(null);
    setStatusMessage('Fetching weather data...');

    try {
      const response = await getWeatherData(
        selectedLocation.coordinates,
        dateRange.startDate,
        dateRange.endDate
      );
      const data = response as WeatherAPIResponse;

      setIsProcessing(true);
      setStatusMessage('Processing weather data...');

      const processedData: WeatherData[] = data.properties.timeseries
        .filter((entry: WeatherDataPoint) => {
          const time = new Date(entry.time);
          return time >= dateRange.startDate && time <= dateRange.endDate;
        })
        .map((entry: WeatherDataPoint) => ({
          time: entry.time,
          temperature: entry.data.instant.details.air_temperature,
          humidity: entry.data.instant.details.relative_humidity,
          pressure: entry.data.instant.details.air_pressure_at_sea_level,
          windSpeed: entry.data.instant.details.wind_speed,
          windDirection: entry.data.instant.details.wind_from_direction,
          precipitation: entry.data.next_1_hours?.details.precipitation_amount || 0,
        }));

      console.log('Processed data:', {
        totalRecords: data.properties.timeseries.length,
        filteredRecords: processedData.length,
        startDate: dateRange.startDate.toISOString(),
        endDate: dateRange.endDate.toISOString(),
      });

      if (processedData.length === 0) {
        setError('No weather data available for the selected date range.');
      } else {
        setWeatherData(processedData);
        setStatusMessage(
          `Found ${processedData.length} weather records between ${dateRange.startDate.toLocaleDateString('en-US')} and ${dateRange.endDate.toLocaleDateString('en-US')}`
        );
      }
    } catch (err) {
      setError('Error occurred while fetching weather data');
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Weather Data Fetch</h1>
      </header>
      <main>
        <section className="search-section">
          <h2>Select Location</h2>
          <LocationSearch onLocationSelect={handleLocationSelect} />
          {selectedLocation && (
            <div className="selected-location">
              <h3>Selected Location:</h3>
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
                onClick={handleFetchData}
                disabled={isLoading || isProcessing}
              >
                {isLoading ? 'Fetching...' : isProcessing ? 'Processing...' : 'Fetch Weather Data'}
              </button>
              {statusMessage && !error && <div className="status-message">{statusMessage}</div>}
            </div>
          )}
        </section>
        {(weatherData.length > 0 || isLoading || isProcessing || error) && (
          <>
            <section className="data-section">
              <h2>Weather Charts</h2>
              <WeatherCharts data={weatherData} />
            </section>
            <section className="data-section">
              <h2>Weather Data Table</h2>
              <WeatherDataTable
                data={weatherData}
                isLoading={isLoading || isProcessing}
                error={error || undefined}
              />
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
