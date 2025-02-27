import React, { useState } from 'react';
import './InfoPanel.css';

export const InfoPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className={`info-panel-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle information panel"
      >
        <span className="toggle-text">
          {isOpen ? 'Zamknij informacje' : 'Informacje o aplikacji'}
        </span>
        <span className="toggle-icon">{isOpen ? '▼' : '▲'}</span>
      </button>
      <div className={`info-panel ${isOpen ? 'open' : ''}`}>
        <div className="info-panel-content">
          <section className="info-section">
            <h3>Źródła Danych</h3>
            <ul>
              <li>
                Dane pogodowe:{' '}
                <a href="https://api.met.no/" target="_blank" rel="noopener noreferrer">
                  MET Norway Weather API
                </a>
                <p className="api-details">
                  Aktualizacja danych co godzinę. Dostępne dane historyczne do 90 dni wstecz.
                </p>
              </li>
              <li>
                Wyszukiwanie lokalizacji:{' '}
                <a
                  href="https://nominatim.openstreetmap.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  OpenStreetMap Nominatim
                </a>
                <p className="api-details">
                  Globalna baza danych lokalizacji, aktualizowana przez społeczność OpenStreetMap.
                </p>
              </li>
            </ul>
          </section>

          <section className="info-section">
            <h3>Polityka Prywatności i Cookies</h3>
            <p>Aplikacja wykorzystuje następujące dane:</p>
            <ul>
              <li>
                <strong>Lokalne przechowywanie:</strong> Zapisujemy ostatnio wybrane lokalizacje i
                ustawienia interfejsu dla wygody użytkownika.
              </li>
              <li>
                <strong>Cookies techniczne:</strong> Niezbędne do prawidłowego działania aplikacji i
                zachowania preferencji użytkownika.
              </li>
            </ul>
            <p className="privacy-note">
              Nie zbieramy żadnych danych osobowych. Wszystkie dane są przechowywane lokalnie w
              przeglądarce użytkownika.
            </p>
          </section>

          <section className="info-section">
            <h3>Limity API</h3>
            <ul>
              <li>MET Norway: max 20 zapytań na sekundę</li>
              <li>Nominatim: max 1 zapytanie na sekundę</li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
};
