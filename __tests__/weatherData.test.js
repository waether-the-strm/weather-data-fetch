const { parseCSVFile } = require("../src/utils/csvParser");
const path = require("path");

const LATITUDE = 66.2167;
const LONGITUDE = 13.6167;
const API_URL = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${LATITUDE}&lon=${LONGITUDE}`;
const NO_DATA_VALUE = 65535;

// Helper function to parse CSV date format to ISO string
function parseCSVDate(dateStr) {
  if (!dateStr || typeof dateStr !== "string") {
    console.error("Invalid date string:", dateStr);
    return null;
  }

  try {
    const [datePart, timePart] = dateStr.split(" ");
    const [day, month, year] = datePart.split(".");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(
      2,
      "0"
    )}T${timePart}`;
  } catch (error) {
    console.error("Error parsing date:", dateStr, error);
    return null;
  }
}

// Helper function to sum precipitation over 3 hours from API data
function sumPrecipitation3h(entry) {
  try {
    const next1h = entry.data.next_1_hours?.details?.precipitation_amount || 0;
    const next2h = entry.data.next_2_hours?.details?.precipitation_amount || 0;
    const next3h = entry.data.next_3_hours?.details?.precipitation_amount || 0;

    if (next3h > 0) return next3h;
    if (next2h > 0) return next2h;
    return next1h;
  } catch (error) {
    console.error("Error calculating precipitation:", error);
    return 0;
  }
}

describe("Weather Data Validation", () => {
  let referenceData;

  beforeAll(async () => {
    // Load reference data from CSV
    const csvPath = path.join(__dirname, "..", "precip_CM39.csv");
    referenceData = await parseCSVFile(csvPath);
    console.log("Loaded reference data:", referenceData.slice(0, 2));
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

    // Get only valid reference data (exclude NO_DATA_VALUE)
    const validReferenceData = referenceData.filter((record) => {
      const precipValue = parseFloat(record["rr3h(mm)"]);
      return !isNaN(precipValue) && precipValue !== NO_DATA_VALUE;
    });

    console.log("Valid reference data count:", validReferenceData.length);

    // Compare only recent data that overlaps with API forecast
    const recentReferenceData = validReferenceData.filter((record) => {
      const isoDate = parseCSVDate(record.Date);
      if (!isoDate) return false;

      const recordDate = new Date(isoDate);
      const now = new Date();
      // Check if the record is within the last 24 hours
      return (
        recordDate >= new Date(now - 24 * 60 * 60 * 1000) && recordDate <= now
      );
    });

    console.log("Recent reference data count:", recentReferenceData.length);

    for (const record of recentReferenceData) {
      const isoDate = parseCSVDate(record.Date);
      if (!isoDate) continue;

      const recordDate = new Date(isoDate);

      // Find matching timestamp in API data
      const apiRecord = apiData.find((entry) => {
        const entryDate = new Date(entry.time);
        // Allow 5 minutes difference in timestamps
        return Math.abs(entryDate - recordDate) <= 5 * 60 * 1000;
      });

      if (apiRecord) {
        const apiPrecip = sumPrecipitation3h(apiRecord);
        const refPrecip = parseFloat(record["rr3h(mm)"]);

        console.log(`Comparing precipitation for ${record.Date}:`);
        console.log(`  API: ${apiPrecip}mm, Reference: ${refPrecip}mm`);

        // Allow for 1mm margin of error for 3-hour precipitation
        expect(Math.abs(apiPrecip - refPrecip)).toBeLessThanOrEqual(1.0);
      }
    }
  });

  test("Temperature data is within reasonable range for Hemnes", async () => {
    const response = await fetch(API_URL, {
      headers: {
        "User-Agent": "WeatherApp/1.0 (weather-data-fetch)",
      },
    });
    const data = await response.json();

    data.properties.timeseries.forEach((entry) => {
      const temp = entry.data.instant.details.air_temperature;
      const date = new Date(entry.time);
      const month = date.getMonth(); // 0-11

      // Adjust expected temperature ranges based on season
      if (month >= 5 && month <= 8) {
        // Summer (June-September)
        expect(temp).toBeGreaterThan(-5);
        expect(temp).toBeLessThan(30);
      } else if (month >= 11 || month <= 2) {
        // Winter (December-March)
        expect(temp).toBeGreaterThan(-25);
        expect(temp).toBeLessThan(10);
      } else {
        // Spring/Autumn
        expect(temp).toBeGreaterThan(-15);
        expect(temp).toBeLessThan(20);
      }
    });
  });
});
