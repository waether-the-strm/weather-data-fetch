import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import './WeatherCharts.css';

interface WeatherData {
  time: string;
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  precipitation: number;
}

interface ChartConfig {
  key: keyof Omit<WeatherData, 'time'>;
  label: string;
  color: string;
  unit: string;
}

const CHART_CONFIGS: ChartConfig[] = [
  { key: 'temperature', label: 'Temperature', color: '#ef4444', unit: '°C' },
  { key: 'humidity', label: 'Humidity', color: '#3b82f6', unit: '%' },
  { key: 'pressure', label: 'Pressure', color: '#8b5cf6', unit: 'hPa' },
  { key: 'windSpeed', label: 'Wind Speed', color: '#10b981', unit: 'm/s' },
  { key: 'windDirection', label: 'Wind Direction', color: '#f59e0b', unit: '°' },
  { key: 'precipitation', label: 'Precipitation', color: '#6366f1', unit: 'mm' },
];

interface WeatherChartsProps {
  data: WeatherData[];
}

export const WeatherCharts: React.FC<WeatherChartsProps> = ({ data }) => {
  const [selectedMetrics, setSelectedMetrics] = useState<Set<keyof Omit<WeatherData, 'time'>>>(
    new Set(['temperature', 'precipitation'])
  );

  const handleMetricToggle = (metric: keyof Omit<WeatherData, 'time'>) => {
    const newSelected = new Set(selectedMetrics);
    if (newSelected.has(metric)) {
      newSelected.delete(metric);
    } else {
      newSelected.add(metric);
    }
    setSelectedMetrics(newSelected);
  };

  const formatXAxis = (time: string) => {
    return new Date(time).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
    });
  };

  if (!data.length) {
    return <div className="charts-empty">No data available for charts</div>;
  }

  return (
    <div className="weather-charts">
      <div className="charts-controls">
        <h4>Select metrics to display:</h4>
        <div className="metric-checkboxes">
          {CHART_CONFIGS.map((config) => (
            <label key={config.key} className="metric-checkbox">
              <input
                type="checkbox"
                checked={selectedMetrics.has(config.key)}
                onChange={() => handleMetricToggle(config.key)}
              />
              <span className="metric-color" style={{ backgroundColor: config.color }}></span>
              {config.label}
            </label>
          ))}
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              tickFormatter={formatXAxis}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(label) => new Date(label).toLocaleString('en-US')}
              formatter={(value: number, name: string) => [
                value.toFixed(1),
                CHART_CONFIGS.find((c) => c.key === name)?.label || name,
              ]}
            />
            <Legend />
            {CHART_CONFIGS.filter((config) => selectedMetrics.has(config.key)).map((config) => (
              <Line
                key={config.key}
                type="monotone"
                dataKey={config.key}
                stroke={config.color}
                name={`${config.label} (${config.unit})`}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
