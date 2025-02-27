import { LocationSearch } from './components/LocationSearch';
import { LocationSearchResult } from './types/weather';

function App() {
  const handleLocationSelect = (location: LocationSearchResult) => {
    console.log('Selected location:', location);
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
        </section>
      </main>
    </div>
  );
}

export default App;
