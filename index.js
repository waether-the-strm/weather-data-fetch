const fetch = require("node-fetch");

// Geographic coordinates for Hemnes, Norway
const latitude = 66.2167;
const longitude = 13.6167;

// MET Norway API URL with location parameters
const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${latitude}&lon=${longitude}`;

// HTTP request options
const options = {
  method: "GET",
  headers: {
    "User-Agent": "WeatherApp/1.0 (weather-data-fetch)",
  },
};

// Date formatting function
function formatDate(dateString) {
  return new Date(dateString).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

// Function to fetch weather data
async function getWeatherData() {
  try {
    console.log("Fetching weather data for Hemnes, Norway...\n");

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const data = await response.json();
    const nextHours = data.properties.timeseries.slice(0, 24); // Get forecasts for next 24 hours

    nextHours.forEach((entry) => {
      const time = formatDate(entry.time);
      const details = entry.data.instant.details;
      const precipitation =
        entry.data.next_1_hours?.details?.precipitation_amount;

      console.log(`📅 Time: ${time}`);
      console.log(`🌡️  Temperature: ${details.air_temperature}°C`);
      console.log(`💨 Wind speed: ${details.wind_speed} m/s`);
      console.log(`🧭 Wind direction: ${details.wind_from_direction}°`);
      console.log(`☔ Precipitation (1h): ${precipitation || "No data"} mm`);
      console.log(`💧 Humidity: ${details.relative_humidity}%`);
      console.log(`☁️  Cloud coverage: ${details.cloud_area_fraction}%`);
      console.log("─────────────────────────────\n");
    });
  } catch (error) {
    console.error(`❌ Error occurred: ${error.message}`);
    process.exit(1);
  }
}

// Function call
getWeatherData();
