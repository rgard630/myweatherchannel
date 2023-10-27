// DOM Elements
const cityForm = document.getElementById("city-form");
const cityInput = document.getElementById("city-input");
const cityInfo = document.getElementById("city-info");
const currentDate = document.getElementById("current-date");
const weatherIcon = document.getElementById("weather-icon");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const forecastContainer = document.getElementById("forecast-container");
const historyList = document.getElementById("history-list");

// API Key for OpenWeatherMap
const apiKey = "9e3c556d7456a8dc80a82a1be6612d17";

// Event Listeners
cityForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const cityName = cityInput.value.trim();
    if (cityName) {
        getWeatherData(cityName);
        cityInput.value = ""; // Clear the input field
    }
});

// Function to fetch and display weather data
function getWeatherData(cityName) {
    // API URL for current weather data
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

    fetch(currentWeatherUrl)
        .then((response) => response.json())
        .then((data) => {
            // Display current weather data
            const { name, weather, main, wind, dt } = data;
            cityInfo.innerHTML = `<h3>${name}</h3>`;
            currentDate.textContent = new Date(dt * 1000).toDateString();
            weatherIcon.src = `https://openweathermap.org/img/w/${weather[0].icon}.png`;
            temperature.textContent = `Temperature: ${main.temp}°C`;
            humidity.textContent = `Humidity: ${main.humidity}%`;
            windSpeed.textContent = `Wind Speed: ${wind.speed} m/s`;

            // Fetch and display 5-day forecast data
            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;

            fetch(forecastUrl)
                .then((response) => response.json())
                .then((forecastData) => {
                    forecastContainer.innerHTML = ""; // Clear previous forecast data
                    for (let i = 0; i < forecastData.list.length; i += 8) {
                        const forecast = forecastData.list[i];
                        const forecastDate = new Date(forecast.dt * 1000).toDateString();
                        const forecastIcon = forecast.weather[0].icon;
                        const forecastTemp = forecast.main.temp;
                        const forecastWind = forecast.wind.speed;
                        const forecastHumidity = forecast.main.humidity;

                        const forecastCard = document.createElement("div");
                        forecastCard.classList.add("forecast-card");
                        forecastCard.innerHTML = `
                            <p>${forecastDate}</p>
                            <img src="https://openweathermap.org/img/w/${forecastIcon}.png" alt="Forecast Icon">
                            <p>Temp: ${forecastTemp}°C</p>
                            <p>Wind: ${forecastWind} m/s</p>
                            <p>Humidity: ${forecastHumidity}%`;
                        forecastContainer.appendChild(forecastCard);
                    }
                })
                .catch((error) => console.error("Error fetching forecast data:", error));
        })
        .catch((error) => console.error("Error fetching weather data:", error));

    // Add the searched city to the search history
    const historyItem = document.createElement("li");
    historyItem.classList.add("history-item");
    historyItem.textContent = cityName;
    historyItem.addEventListener("click", () => getWeatherData(cityName));
    historyList.appendChild(historyItem);
}