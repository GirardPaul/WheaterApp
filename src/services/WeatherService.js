export const initWeatherForAddress = async (address, unit) => {
  const apiKey = import.meta.env.VITE_WEATHER_KEY;
  let weather = {
    current: null,
    forecast: null,
  };
  const currentWeatherUri = `https://api.openweathermap.org/data/2.5/weather?lat=${address.lat}&lon=${address.lng}&appid=${apiKey}&units=metric&lang=fr`;
  const forecastWeatherUri = `https://api.openweathermap.org/data/2.5/forecast?lat=${address.lat}&lon=${address.lng}&appid=${apiKey}&units=metric&lang=fr`;
  const [currentWeather, forecastWeather] = await Promise.all([
    fetch(currentWeatherUri),
    fetch(forecastWeatherUri),
  ]).then((responses) => Promise.all(responses.map((r) => r.json())));

  if (currentWeather) {
    weather.current = {};
    weather.current.weather =
      currentWeather.weather && currentWeather.weather.length
        ? firstLetterCapitalized(currentWeather.weather[0].description)
        : null;
    weather.current.windSpeed =
      currentWeather.wind && currentWeather.wind.speed
        ? convertMetersPerSecondToKilometersPerHour(currentWeather.wind.speed)
        : null;
    weather.current.windDegree = currentWeather.wind && currentWeather.wind.deg;
    weather.current.windDirection =
      currentWeather.wind && currentWeather.wind.deg
        ? convertWindDegreesToDirection(currentWeather.wind.deg)
        : null;
    weather.current.humidity =
      currentWeather.main && currentWeather.main.humidity;
    weather.current.visibility = currentWeather.visibility
      ? currentWeather.visibility / 1000
      : null;
    weather.current.pressure =
      currentWeather.main && currentWeather.main.pressure;
    weather.current.temperature =
      currentWeather.main &&
      currentWeather.main.temp &&
      Math.round(currentWeather.main.temp);
    weather.current.imgUrl =
      currentWeather.weather && currentWeather.weather.length
        ? formatImgUrl(currentWeather.weather[0].icon)
        : null;
  }

  return weather;
};

const firstLetterCapitalized = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
const convertMetersPerSecondToKilometersPerHour = (metersPerSecond) => {
  return Math.round(metersPerSecond * 3.6);
};
const convertWindDegreesToDirection = (degrees) => {
  const coords = [
    { label: "N", degreeLimit: 348.75 },
    { label: "NNE", degreeLimit: 11.25 },
    { label: "NE", degreeLimit: 33.75 },
    { label: "ENE", degreeLimit: 56.25 },
    { label: "E", degreeLimit: 78.75 },
    { label: "ESE", degreeLimit: 101.25 },
    { label: "SE", degreeLimit: 123.75 },
    { label: "SSE", degreeLimit: 146.25 },
    { label: "S", degreeLimit: 168.75 },
    { label: "SSO", degreeLimit: 191.25 },
    { label: "S0", degreeLimit: 213.75 },
    { label: "0S0", degreeLimit: 236.25 },
    { label: "0", degreeLimit: 258.75 },
    { label: "0N0", degreeLimit: 281.25 },
    { label: "N0", degreeLimit: 303.75 },
    { label: "NN0", degreeLimit: 326.25 },
    { label: "N", degreeLimit: 360 },
  ];

  const normalizedDegrees = ((degrees % 360) + 360) % 360;

  for (const direction of coords) {
    if (normalizedDegrees >= direction.degreeLimit) {
      return direction.label;
    }
  }

  return "N";
};

const formatImgUrl = (icon) => {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
};
