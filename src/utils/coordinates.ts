interface Coordinates {
  lat: number;
  lon: number;
}

/**
 * Validates if the given number is a valid latitude
 */
export const isValidLatitude = (lat: number): boolean => {
  return !isNaN(lat) && lat >= -90 && lat <= 90;
};

/**
 * Validates if the given number is a valid longitude
 */
export const isValidLongitude = (lon: number): boolean => {
  return !isNaN(lon) && lon >= -180 && lon <= 180;
};

/**
 * Tries to parse coordinates from a string
 * Accepts formats:
 * - "52.229676, 21.012229"
 * - "52.229676,21.012229"
 * - "52.229676 21.012229"
 */
export const parseCoordinates = (input: string): Coordinates | null => {
  // Remove all spaces and split by comma or space
  const parts = input
    .replace(/\s+/g, ' ')
    .trim()
    .split(/[,\s]+/);

  if (parts.length !== 2) {
    return null;
  }

  const lat = parseFloat(parts[0]);
  const lon = parseFloat(parts[1]);

  if (!isValidLatitude(lat) || !isValidLongitude(lon)) {
    return null;
  }

  return { lat, lon };
};

/**
 * Formats coordinates to a string
 */
export const formatCoordinates = (coordinates: Coordinates): string => {
  return `${coordinates.lat.toFixed(6)}, ${coordinates.lon.toFixed(6)}`;
};
