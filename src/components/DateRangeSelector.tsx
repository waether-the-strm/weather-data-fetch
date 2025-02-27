import React, { useState } from 'react';
import './DateRangeSelector.css';

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface DateRangeSelectorProps {
  onChange: (range: DateRange) => void;
  disabled?: boolean;
}

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  onChange,
  disabled = false,
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const date = new Date(value);

    const startInput = document.querySelector<HTMLInputElement>('input[name="startDate"]');
    const endInput = document.querySelector<HTMLInputElement>('input[name="endDate"]');

    let startDate = name === 'startDate' ? date : new Date(startInput?.value || '');
    let endDate = name === 'endDate' ? date : new Date(endInput?.value || '');

    // Walidacja dat
    if (startDate > endDate) {
      setError('Data początkowa nie może być późniejsza niż końcowa');
      return;
    }

    // Sprawdź czy zakres nie jest większy niż 30 dni
    const daysDifference = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysDifference > 30) {
      setError('Maksymalny zakres dat to 30 dni');
      return;
    }

    setError(null);
    onChange({ startDate, endDate });
  };

  // Format daty YYYY-MM-DD dla inputa
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Domyślne daty: ostatnie 7 dni
  const today = new Date();
  const lastWeek = new Date();
  lastWeek.setDate(today.getDate() - 7);

  return (
    <div className="date-range-selector">
      <div className="date-inputs-container">
        <div className="date-input-group">
          <label htmlFor="startDate">Data początkowa:</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            defaultValue={formatDateForInput(lastWeek)}
            onChange={handleDateChange}
            disabled={disabled}
          />
        </div>
        <div className="date-input-group">
          <label htmlFor="endDate">Data końcowa:</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            defaultValue={formatDateForInput(today)}
            onChange={handleDateChange}
            disabled={disabled}
          />
        </div>
      </div>
      {error && <div className="date-range-error">{error}</div>}
    </div>
  );
};
