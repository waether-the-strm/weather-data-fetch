export interface WeatherDetails {
  air_pressure_at_sea_level: number;
  air_temperature: number;
  cloud_area_fraction: number;
  relative_humidity: number;
  wind_from_direction: number;
  wind_speed: number;
}

export interface Precipitation {
  precipitation_amount: number;
}

export interface WeatherDataPoint {
  time: string;
  data: {
    instant: {
      details: WeatherDetails;
    };
    next_1_hours?: {
      details: Precipitation;
    };
  };
}

export interface WeatherAPIResponse {
  type: string;
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  properties: {
    meta: {
      updated_at: string;
      units: {
        air_pressure_at_sea_level: string;
        air_temperature: string;
        cloud_area_fraction: string;
        precipitation_amount: string;
        relative_humidity: string;
        wind_from_direction: string;
        wind_speed: string;
      };
    };
    timeseries: WeatherDataPoint[];
  };
}

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface LocationSearchResult {
  id: string;
  name: string;
  country: string;
  coordinates: Coordinates;
}

export interface WeatherLocation {
  type: string;
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  properties: {
    meta: {
      updated_at: string;
    };
    timeseries: Array<{
      time: string;
      data: {
        instant: {
          details: {
            air_temperature: number;
            precipitation_amount: number;
            relative_humidity: number;
            wind_speed: number;
          };
        };
      };
    }>;
  };
}
