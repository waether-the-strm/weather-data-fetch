import { LocationSearchResult, Coordinates } from '../types/weather';

const MET_BASE_URL = 'https://api.met.no/weatherapi/locationforecast/2.0';
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const OPEN_METEO_URL = 'https://archive-api.open-meteo.com/v1/archive';

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
    // We'll check both APIs
    const [metResponse, openMeteoResponse] = await Promise.all([
      fetch(`${MET_BASE_URL}/complete?lat=${coordinates.lat}&lon=${coordinates.lon}`, { headers }),
      fetch(
        `${OPEN_METEO_URL}?latitude=${coordinates.lat}&longitude=${coordinates.lon}&start_date=2023-01-01&end_date=2023-01-02&hourly=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,wind_direction_10m,precipitation`
      ),
    ]);
    return metResponse.ok || openMeteoResponse.ok;
  } catch {
    return false;
  }
}

export async function getWeatherData(coordinates: Coordinates, startDate: Date, endDate: Date) {
  // Format dates as YYYY-MM-DD
  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  // Get historical data from Open-Meteo
  const openMeteoParams = new URLSearchParams({
    latitude: coordinates.lat.toString(),
    longitude: coordinates.lon.toString(),
    start_date: formatDate(startDate),
    end_date: formatDate(endDate),
    hourly:
      'temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,wind_direction_10m,precipitation',
    timezone: 'auto',
  });

  const response = await fetch(`${OPEN_METEO_URL}?${openMeteoParams}`);

  if (!response.ok) {
    throw new Error('Failed to fetch weather data from the server');
  }

  const data = await response.json();

  // Transform Open-Meteo response to match our WeatherAPIResponse format
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [coordinates.lon, coordinates.lat],
    },
    properties: {
      meta: {
        updated_at: new Date().toISOString(),
        units: {
          air_pressure_at_sea_level: 'hPa',
          air_temperature: '°C',
          precipitation_amount: 'mm',
          relative_humidity: '%',
          wind_from_direction: 'degrees',
          wind_speed: 'm/s',
        },
      },
      timeseries: data.hourly.time.map((time: string, index: number) => ({
        time,
        data: {
          instant: {
            details: {
              air_temperature: data.hourly.temperature_2m[index],
              relative_humidity: data.hourly.relative_humidity_2m[index],
              air_pressure_at_sea_level: data.hourly.surface_pressure[index],
              wind_speed: data.hourly.wind_speed_10m[index],
              wind_from_direction: data.hourly.wind_direction_10m[index],
            },
          },
          next_1_hours: {
            details: {
              precipitation_amount: data.hourly.precipitation[index],
            },
          },
        },
      })),
    },
  };
}
