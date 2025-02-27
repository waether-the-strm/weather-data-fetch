import React from 'react';
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
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const date = new Date(value);

    if (name === 'startDate') {
      onChange({
        startDate: date,
        endDate: new Date(
          document.querySelector<HTMLInputElement>('input[name="endDate"]')?.value || ''
        ),
      });
    } else {
      onChange({
        startDate: new Date(
          document.querySelector<HTMLInputElement>('input[name="startDate"]')?.value || ''
        ),
        endDate: date,
      });
    }
  };

  // Ustaw domyślne daty: dziś i za tydzień
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  // Format daty YYYY-MM-DD dla inputa
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="date-range-selector">
      <div className="date-input-group">
        <label htmlFor="startDate">Data początkowa:</label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          defaultValue={formatDateForInput(today)}
          min={formatDateForInput(today)}
          max={formatDateForInput(nextWeek)}
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
          defaultValue={formatDateForInput(nextWeek)}
          min={formatDateForInput(today)}
          max={formatDateForInput(nextWeek)}
          onChange={handleDateChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
};
