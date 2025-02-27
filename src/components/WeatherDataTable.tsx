import React from 'react';
import './WeatherDataTable.css';

interface WeatherData {
  time: string;
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  precipitation: number;
}

interface WeatherDataTableProps {
  data: WeatherData[];
  isLoading: boolean;
  error?: string;
}

export const WeatherDataTable: React.FC<WeatherDataTableProps> = ({ data, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="weather-data-loading">
        <div className="spinner"></div>
        <p>Fetching weather data...</p>
      </div>
    );
  }

  if (error) {
    return <div className="weather-data-error">{error}</div>;
  }

  if (!data.length) {
    return <div className="weather-data-empty">No data to display</div>;
  }

  return (
    <div className="weather-data-table-container">
      <table className="weather-data-table">
        <thead>
          <tr>
            <th>Date and Time</th>
            <th>Temperature (°C)</th>
            <th>Humidity (%)</th>
            <th>Pressure (hPa)</th>
            <th>Wind Speed (m/s)</th>
            <th>Wind Direction (°)</th>
            <th>Precipitation (mm)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{new Date(row.time).toLocaleString('en-US')}</td>
              <td>{row.temperature.toFixed(1)}</td>
              <td>{row.humidity.toFixed(0)}</td>
              <td>{row.pressure.toFixed(0)}</td>
              <td>{row.windSpeed.toFixed(1)}</td>
              <td>{row.windDirection}</td>
              <td>{row.precipitation.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
