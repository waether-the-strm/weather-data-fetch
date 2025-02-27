import React, { useState } from 'react';
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

interface Column {
  key: keyof WeatherData;
  label: string;
  unit: string;
}

const COLUMNS: Column[] = [
  { key: 'time', label: 'Date and Time', unit: '' },
  { key: 'temperature', label: 'Temperature', unit: '°C' },
  { key: 'humidity', label: 'Humidity', unit: '%' },
  { key: 'pressure', label: 'Pressure', unit: 'hPa' },
  { key: 'windSpeed', label: 'Wind Speed', unit: 'm/s' },
  { key: 'windDirection', label: 'Wind Direction', unit: '°' },
  { key: 'precipitation', label: 'Precipitation', unit: 'mm' },
];

interface WeatherDataTableProps {
  data: WeatherData[];
  isLoading: boolean;
  error?: string;
}

export const WeatherDataTable: React.FC<WeatherDataTableProps> = ({ data, isLoading, error }) => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [selectedColumns, setSelectedColumns] = useState<Set<keyof WeatherData>>(
    new Set(COLUMNS.map((col) => col.key))
  );

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const handleColumnToggle = (columnKey: keyof WeatherData) => {
    const newSelected = new Set(selectedColumns);
    if (newSelected.has(columnKey)) {
      newSelected.delete(columnKey);
    } else {
      newSelected.add(columnKey);
    }
    setSelectedColumns(newSelected);
  };

  const handleExportCSV = () => {
    const selectedColumnsArray = COLUMNS.filter((col) => selectedColumns.has(col.key));

    // Create CSV header
    const header = selectedColumnsArray.map((col) => `${col.label} (${col.unit})`).join(',');

    // Create CSV rows
    const rows = data.map((row) =>
      selectedColumnsArray
        .map((col) => {
          const value = row[col.key];
          return col.key === 'time'
            ? new Date(value as string).toLocaleString('en-US')
            : value.toString();
        })
        .join(',')
    );

    // Combine header and rows
    const csv = [header, ...rows].join('\n');

    // Create and trigger download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'weather_data.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
    <div className="weather-data-container">
      <div className="table-controls">
        <div className="column-selector">
          <h4>Select columns to display and export:</h4>
          <div className="column-checkboxes">
            {COLUMNS.map((column) => (
              <label key={column.key} className="column-checkbox">
                <input
                  type="checkbox"
                  checked={selectedColumns.has(column.key)}
                  onChange={() => handleColumnToggle(column.key)}
                />
                {column.label}
              </label>
            ))}
          </div>
        </div>
        <div className="export-controls">
          <button className="export-button" onClick={handleExportCSV}>
            Export Selected Columns to CSV
          </button>
        </div>
      </div>

      <div className="weather-data-table-container">
        <table className="weather-data-table">
          <thead>
            <tr>
              {COLUMNS.filter((col) => selectedColumns.has(col.key)).map((column) => (
                <th key={column.key}>
                  {column.label}
                  {column.unit && <span className="unit"> ({column.unit})</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, index) => (
              <tr key={index}>
                {COLUMNS.filter((col) => selectedColumns.has(col.key)).map((column) => (
                  <td key={column.key}>
                    {column.key === 'time'
                      ? new Date(row[column.key]).toLocaleString('en-US')
                      : row[column.key].toFixed(1)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination-controls">
        <select
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setPage(1);
          }}
        >
          <option value="10">10 rows</option>
          <option value="25">25 rows</option>
          <option value="50">50 rows</option>
          <option value="100">100 rows</option>
        </select>
        <div className="pagination-buttons">
          <button onClick={() => setPage(1)} disabled={page === 1}>
            First
          </button>
          <button onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
            Previous
          </button>
          <span className="pagination-info">
            Page {page} of {totalPages}
          </span>
          <button onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}>
            Next
          </button>
          <button onClick={() => setPage(totalPages)} disabled={page === totalPages}>
            Last
          </button>
        </div>
      </div>
    </div>
  );
};
