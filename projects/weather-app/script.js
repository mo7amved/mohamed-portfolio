const form = document.getElementById("searchForm");
const input = document.getElementById("cityInput");
const statusEl = document.getElementById("status");
const weatherEl = document.getElementById("weather");
const button = document.getElementById("searchButton");
const codeMap = {
  0: ["Clear sky", "☀️"],
  1: ["Mainly clear", "🌤️"],
  2: ["Partly cloudy", "⛅"],
  3: ["Overcast", "☁️"],
  45: ["Fog", "🌫️"],
  48: ["Depositing rime fog", "🌫️"],
  51: ["Light drizzle", "🌦️"],
  53: ["Drizzle", "🌦️"],
  55: ["Dense drizzle", "🌧️"],
  61: ["Slight rain", "🌦️"],
  63: ["Moderate rain", "🌧️"],
  65: ["Heavy rain", "🌧️"],
  71: ["Slight snow", "🌨️"],
  73: ["Moderate snow", "❄️"],
  75: ["Heavy snow", "❄️"],
  80: ["Rain showers", "🌦️"],
  81: ["Rain showers", "🌧️"],
  82: ["Heavy showers", "⛈️"],
  95: ["Thunderstorm", "⛈️"],
  96: ["Thunderstorm with hail", "⛈️"],
  99: ["Thunderstorm with hail", "⛈️"],
};
function weatherInfo(code) {
  return codeMap[code] || ["Variable conditions", "🌤️"];
}
function dayName(date) {
  return new Date(date + "T12:00:00").toLocaleDateString(undefined, {
    weekday: "short",
  });
}
async function getWeather(city) {
  button.disabled = true;
  button.textContent = "Searching…";
  statusEl.textContent = "Looking up " + city + "…";
  weatherEl.hidden = true;
  try {
    const geoResponse = await fetch(
      "https://geocoding-api.open-meteo.com/v1/search?name=" +
        encodeURIComponent(city) +
        "&count=1&language=en&format=json",
    );
    if (!geoResponse.ok)
      throw new Error("Could not reach the location service.");
    const geo = await geoResponse.json();
    if (!geo.results?.length)
      throw new Error("City not found. Check the spelling and try again.");
    const place = geo.results[0];
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=5&timezone=auto`;
    const response = await fetch(url);
    if (!response.ok)
      throw new Error("Could not load weather data. Please try again.");
    const data = await response.json();
    const current = data.current;
    const info = weatherInfo(current.weather_code);
    document.getElementById("location").textContent = [
      place.name,
      place.admin1,
      place.country,
    ]
      .filter(Boolean)
      .join(", ");
    document.getElementById("condition").textContent = info[0];
    document.getElementById("temperature").textContent = Math.round(
      current.temperature_2m,
    );
    document.getElementById("weatherIcon").textContent = current.is_day
      ? info[1]
      : { "☀️": "🌙", "🌤️": "🌙", "⛅": "☁️" }[info[1]] || info[1];
    document.getElementById("range").textContent =
      `Today's range: ${Math.round(data.daily.temperature_2m_min[0])}° / ${Math.round(data.daily.temperature_2m_max[0])}°C`;
    document.getElementById("feels").textContent =
      Math.round(current.apparent_temperature) + "°C";
    document.getElementById("wind").textContent =
      Math.round(current.wind_speed_10m) + " km/h";
    document.getElementById("humidity").textContent =
      current.relative_humidity_2m + "%";
    const forecast = document.getElementById("forecast");
    forecast.replaceChildren();
    data.daily.time.forEach((date, index) => {
      const item = document.createElement("div");
      item.className = "day";
      const day = document.createElement("small");
      day.textContent = index === 0 ? "Today" : dayName(date);
      const icon = document.createElement("div");
      icon.className = "icon";
      icon.textContent = weatherInfo(data.daily.weather_code[index])[1];
      const temp = document.createElement("strong");
      temp.textContent = `${Math.round(data.daily.temperature_2m_max[index])}° / ${Math.round(data.daily.temperature_2m_min[index])}°`;
      item.append(day, icon, temp);
      forecast.append(item);
    });
    weatherEl.hidden = false;
    statusEl.textContent = "";
  } catch (error) {
    statusEl.textContent =
      error.message + " Weather needs an internet connection.";
  } finally {
    button.disabled = false;
    button.textContent = "Search ↗";
  }
}
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const city = input.value.trim();
  if (city) getWeather(city);
});
getWeather("Cairo");
