import { LocationSearch } from './components/LocationSearch';

interface Location {
  id: string;
  name: string;
  coordinates: {
    lat: number;
    lon: number;
  };
}

function App() {
  const handleLocationSelect = (location: Location) => {
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
