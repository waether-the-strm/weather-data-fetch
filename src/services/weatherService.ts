import { LocationSearchResult, Coordinates } from '../types/weather';

const BASE_URL = 'https://api.met.no/weatherapi/locationforecast/2.0';
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

const headers = {
  'User-Agent': 'WeatherDataFetch/1.0 (https://github.com/yourusername/weather-data-fetch)',
};

export async function searchLocation(query: string): Promise<LocationSearchResult[]> {
  const params = new URLSearchParams({
    q: query,
    format: 'json',
    limit: '5',
    addressdetails: '1',
  });

  const response = await fetch(`${NOMINATIM_URL}?${params}`, {
    headers: {
      ...headers,
      'Accept-Language': 'en',
    },
  });

  if (!response.ok) {
    throw new Error('Error while searching for location');
  }

  const data = await response.json();

  return data.map((item: any) => ({
    id: item.place_id,
    name: item.display_name.split(',')[0],
    country: item.address.country || '',
    coordinates: {
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
    },
  }));
}

export async function checkWeatherAvailability(coordinates: Coordinates): Promise<boolean> {
  try {
    const response = await fetch(
      `${BASE_URL}/complete?lat=${coordinates.lat}&lon=${coordinates.lon}`,
      { headers }
    );
    return response.ok;
  } catch {
    return false;
  }
}

export async function getWeatherData(coordinates: Coordinates) {
  const response = await fetch(
    `${BASE_URL}/compact?lat=${coordinates.lat}&lon=${coordinates.lon}`,
    { headers }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch weather data from the server');
  }

  return response.json();
}
