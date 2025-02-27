const { parseCSVFile } = require("../src/utils/csvParser");
const path = require("path");

const LATITUDE = 66.2167;
const LONGITUDE = 13.6167;
const API_URL = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${LATITUDE}&lon=${LONGITUDE}`;

describe("Weather Data Validation", () => {
  let referenceData;

  beforeAll(async () => {
    // Load reference data from CSV
    const csvPath = path.join(__dirname, "..", "precip_CM39.csv");
    referenceData = await parseCSVFile(csvPath);
  });

  test("API data structure matches expected format", async () => {
    const response = await fetch(API_URL, {
      headers: {
        "User-Agent": "WeatherApp/1.0 (weather-data-fetch)",
      },
    });
    expect(response.ok).toBe(true);

    const data = await response.json();
    expect(data).toHaveProperty("properties");
    expect(data.properties).toHaveProperty("timeseries");
    expect(Array.isArray(data.properties.timeseries)).toBe(true);
  });

  test("Precipitation data matches reference values within acceptable margin", async () => {
    const response = await fetch(API_URL, {
      headers: {
        "User-Agent": "WeatherApp/1.0 (weather-data-fetch)",
      },
    });
    const data = await response.json();
    const apiData = data.properties.timeseries;

    // Compare precipitation values
    // Note: This is a placeholder - we need to adjust the comparison logic
    // based on the actual structure of precip_CM39.csv
    for (const record of referenceData.slice(0, 10)) {
      // Find matching timestamp in API data
      const apiRecord = apiData.find((entry) => {
        // Implement matching logic based on CSV structure
        return true; // Placeholder
      });

      if (apiRecord) {
        const apiPrecip =
          apiRecord.data.next_1_hours?.details?.precipitation_amount || 0;
        const refPrecip = parseFloat(record.precipitation || 0);

        // Allow for 0.5mm margin of error
        expect(Math.abs(apiPrecip - refPrecip)).toBeLessThanOrEqual(0.5);
      }
    }
  });

  test("Temperature data is within reasonable range", async () => {
    const response = await fetch(API_URL, {
      headers: {
        "User-Agent": "WeatherApp/1.0 (weather-data-fetch)",
      },
    });
    const data = await response.json();

    data.properties.timeseries.forEach((entry) => {
      const temp = entry.data.instant.details.air_temperature;
      // Reasonable range for Hemnes, Norway
      expect(temp).toBeGreaterThan(-40);
      expect(temp).toBeLessThan(40);
    });
  });
});
