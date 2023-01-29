const shecodesApiKey = "eb00b292o04et83554f3aa07227aa52c";

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let currentDate = document.querySelector("#date");
function formatDate(timestamp) {
  console.log(timestamp);
  let now;
  if (typeof timestamp == "undefined") {
    now = new Date();
  } else {
    now = new Date(timestamp);
  }
  let day = days[now.getDay()];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[now.getMonth()];
  let date = now.getDate();
  let hour = addZero(now.getHours());
  let minute = addZero(now.getMinutes());
  return `${day}, ${month} ${date}, ${hour}:${minute}`;
}

// Add zero for dates without leading zero
function addZero(number) {
  if (number < 10) {
    return "0" + number;
  } else {
    return number;
  }
}

// handle temp measurement switch
let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", changeAllTemp);
let fahrenheitLink = document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", changeAllTemp);

currentDate.innerHTML = formatDate();

function search(event) {
  event.preventDefault();
  let input = document.querySelector("#search-input");
  let city = document.querySelector("#city-name");
  city.innerHTML = input.value;
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", search);

let initialFormat = "celsius";

// Recalculate all temp elements
function changeAllTemp(event) {
  let selectedFormat = event.target.id;

  if (selectedFormat == initialFormat) {
    return;
  }
  initialFormat = selectedFormat;

  let elements = document.querySelectorAll(".degrees, .number");
  elements.forEach((element) => {
    let temp = parseInt(element.innerHTML);

    if (selectedFormat === "celsius") {
      // F to C
      temp = convertFahrenheitToCelsius(temp);
      celsiusLink.classList.add("active");
      fahrenheitLink.classList.remove("active");
    } else if (selectedFormat === "fahrenheit") {
      // C to F
      temp = convertCelciusToFahrenheit(temp);
      celsiusLink.classList.remove("active");
      fahrenheitLink.classList.add("active");
    } else {
      // Unknown measurement. Do nothing
      console.warn("Unknown measurement. Do nothing");
      return;
    }
    element.innerHTML = temp;
  });

  let primeTemp = document.querySelector(".number");
  primeTemp.innerHTML = parseInt(primeTemp.innerHTML);
}

// C to F
function convertCelciusToFahrenheit(temp) {
  return Math.round(temp * 1.8 + 32) + "°F";
}
// F to C
function convertFahrenheitToCelsius(temp) {
  return Math.round((temp - 32) / 1.8) + "°C";
}

//Engine

//CurrentPosition

let apiKey = "210d99196a88b9257ed8cb3535a0a0c5";

function requestTempByPosition(myPosition) {
  let lat = myPosition.coords.latitude;
  let lon = myPosition.coords.longitude;
  console.log(lat, lon);
  let apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  axios.get(`${apiURL}&appid=${apiKey}`).then(displayTemperature);
}

navigator.geolocation.getCurrentPosition(function (pos) {
  requestTempByPosition(pos);
  requestForecastByPosition(pos);
});

function displayTemperature(response) {
  console.log(response.data);
  let temperature = Math.round(response.data.main.temp);
  console.log(temperature);
  let tempInteger = document.querySelector("#temp-integer");
  tempInteger.innerHTML = temperature;

  let description = response.data.weather[0].description;
  console.log(description);
  let descriptionContainer = document.querySelector("#description");
  descriptionContainer.innerHTML = description;

  let icon = response.data.weather[0].icon;
  let locationIcon = document.querySelector(".weather-icon");
  locationIcon.innerHTML = `<img src="src/icons/${icon}.png"/>`;

  let currentCity = response.data.name;
  let cityContainer = document.querySelector("#city-name");
  cityContainer.innerHTML = currentCity;

  let humidity = response.data.main.humidity;
  console.log(humidity);
  let humidityContainer = document.querySelector("#humidity");
  humidityContainer.innerHTML = humidity;

  let wind = response.data.wind.speed;
  let windSpeed = document.querySelector("#wind");
  windSpeed.innerHTML = Math.round(wind);

  // currentDate.innerHTML = formatDate(response.data.dt * 1000);
}

let currentButton = document.querySelector("#current-btn");
currentButton.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(function (pos) {
    requestTempByPosition(pos);
    requestForecastByPosition(pos);
  });
});
//Search by city

function requestTempByCity() {
  let input = document.querySelector("#search-input");
  let city = document.querySelector("#city-name");
  city.innerHTML = input.value;

  let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${input.value}&appid=${apiKey}&units=metric`;

  axios.get(`${apiURL}&appid=${apiKey}`).then(displayTempByCity);
}

function displayTempByCity(response) {
  let temperature = Math.round(response.data.main.temp);

  let tempInteger = document.querySelector("#temp-integer");
  tempInteger.innerHTML = temperature;

  let description = response.data.weather[0].description;
  console.log(description);
  let descriptionContainer = document.querySelector("#description");
  descriptionContainer.innerHTML = description;

  let humidity = response.data.main.humidity;
  console.log(humidity);

  let icon = response.data.weather[0].icon;
  let locationIcon = document.querySelector(".weather-icon");
  locationIcon.innerHTML = `<img src="src/icons/${icon}.png"/>`;
  let input = document.querySelector("#search-input");
  let city = document.querySelector("#city-name");
  city.innerHTML = input.value;

  currentDate.innerHTML = formatDate(response.data.dt * 1000);
}
let searchButton = document.querySelector("#search-btn");
searchButton.addEventListener("click", () => {
  requestTempByCity();
  requestForecastByCity();
});

// Daily/hourly forecast

function requestForecastByPosition(myPosition) {
  let lat = myPosition.coords.latitude;
  let lon = myPosition.coords.longitude;
  let apiURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  const shecodesApiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${lon}&lat=${lat}&key=${shecodesApiKey}`;

  axios.get(`${apiURL}&appid=${apiKey}`).then(displayForecast);
  axios.get(shecodesApiUrl).then(displayDailyForecast);
}

function displayForecast(response) {
  console.log(response.data);
  let list = response.data.list;
  let hourList = list.slice(0, 4);

  displayHourlyForecast(hourList);
  // displayDailyForecast();
}
function displayHourlyForecast(hourlySet) {
  console.log("12 hours", hourlySet);
  for (let i = 0; i < hourlySet.length; i++) {
    const hourContainerId = "#hour" + (i + 1);

    let hourContainer = document.querySelector(hourContainerId);
    const data = hourlySet[i];
    const time = new Date(data.dt * 1000);
    const hour = addZero(time.getHours());
    const minute = addZero(time.getMinutes());
    const iconUrl = data.weather[0].icon;
    const temp = Math.round(data.main.temp);
    hourContainer.innerHTML = `<div class="hour">${hour}:${minute}</div>
                    <div class="emoji-2"><img src="src/icons/${iconUrl}.png" width ="40" height="40"/></div>
                    <div class="degrees">${temp}°C</div>`;
  }
}
function displayDailyForecast(response) {
  console.log("SheCodes API response:", response);
  // Skipping first day
  for (let i = 1; i < 5; i++) {
    const day = response.data.daily[i];
    const dayContainerId = "#day" + i;

    let dayContainer = document.querySelector(dayContainerId);

    const time = new Date(day.time * 1000);
    const dayOfWeek = days[time.getDay()].slice(0, 3);
    const iconUrl = day.condition.icon_url;
    const temp = Math.round(day.temperature.day);
    dayContainer.innerHTML = `<div class="hour">${dayOfWeek}</div>
                    <div class="emoji-2"><img src="${iconUrl}" width ="40" height="40"/></div>
                    <div class="degrees">${temp}°C</div>`;
  }
}

function requestForecastByCity() {
  let input = document.querySelector("#search-input");
  let city = document.querySelector("#city-name");
  city.innerHTML = input.value;

  let apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${input.value}&appid=${apiKey}&units=metric`;

  const shecodesApiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${input.value}&key=${shecodesApiKey}`;

  axios.get(`${apiURL}&appid=${apiKey}`).then(displayForecast);
  axios.get(shecodesApiUrl).then(displayDailyForecast);
}
let hourButton = document.querySelector("#hour-button");
hourButton.addEventListener("click", () => {
  document.querySelector("#hours").classList.remove("hidden");
  document.querySelector("#days").classList.add("hidden");
  hourButton.classList.add("active");
  daysButton.classList.remove("active");
});
let daysButton = document.querySelector("#day-button");
daysButton.addEventListener("click", () => {
  document.querySelector("#hours").classList.add("hidden");
  document.querySelector("#days").classList.remove("hidden");
  hourButton.classList.remove("active");
  daysButton.classList.add("active");
});
