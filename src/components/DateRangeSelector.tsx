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
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Resetujemy czas do północy

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const date = new Date(value);
    date.setHours(0, 0, 0, 0); // Resetujemy czas do północy

    const startInput = document.querySelector<HTMLInputElement>('input[name="startDate"]');
    const endInput = document.querySelector<HTMLInputElement>('input[name="endDate"]');

    let startDate = name === 'startDate' ? date : new Date(startInput?.value || '');
    let endDate = name === 'endDate' ? date : new Date(endInput?.value || '');

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    // Sprawdź czy daty nie są z przyszłości
    if (startDate > today || endDate > today) {
      setError('Nie można wybrać dat z przyszłości');
      return;
    }

    // Walidacja kolejności dat
    if (startDate > endDate) {
      if (name === 'startDate') {
        // Jeśli zmieniono datę początkową, dostosuj datę końcową
        endDate = new Date(startDate);
        if (endInput) endInput.value = formatDateForInput(endDate);
      } else {
        // Jeśli zmieniono datę końcową, dostosuj datę początkową
        startDate = new Date(endDate);
        if (startInput) startInput.value = formatDateForInput(startDate);
      }
    }

    setError(null);
    onChange({ startDate, endDate });
  };

  // Format daty YYYY-MM-DD dla inputa
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Domyślne daty: ostatnie 7 dni
  const lastWeek = new Date(today);
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
            max={formatDateForInput(today)}
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
            max={formatDateForInput(today)}
            onChange={handleDateChange}
            disabled={disabled}
          />
        </div>
      </div>
      {error && <div className="date-range-error">{error}</div>}
    </div>
  );
};
