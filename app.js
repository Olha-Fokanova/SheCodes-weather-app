let currentDate = document.querySelector("#date");
function formatDate(timestamp) {
  console.log(timestamp);
  let now;
  if (typeof timestamp == "undefined") {
    now = new Date();
  } else {
    now = new Date(timestamp);
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
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

navigator.geolocation.getCurrentPosition(requestTempByPosition);

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

  // currentDate.innerHTML = formatDate(response.data.dt * 1000);
}

let currentButton = document.querySelector("#current-btn");
currentButton.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(requestTempByPosition);
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

  let icon = response.data.weather[0].icon;
  let locationIcon = document.querySelector(".weather-icon");
  locationIcon.innerHTML = `<img src="src/icons/${icon}.png"/>`;
  let input = document.querySelector("#search-input");
  let city = document.querySelector("#city-name");
  city.innerHTML = input.value;

  currentDate.innerHTML = formatDate(response.data.dt * 1000);
}
let searchButton = document.querySelector("#search-btn");
searchButton.addEventListener("click", requestTempByCity);
