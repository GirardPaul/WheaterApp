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
    weather.current = formatCurrentWeather(currentWeather, unit);
  }

  if (forecastWeather && forecastWeather.list && forecastWeather.list.length) {
    weather.forecast = formatForecastWeather(forecastWeather, unit);
  }

  return weather;
};

const formatForecastWeather = ({ list }, unit) => {
  let currentDate = new Date();
  let weathers = [];
  let forecastList = list.filter((item) => {
    let itemDate = new Date(item.dt * 1000);
    return !(
      itemDate.getDate() === currentDate.getDate() &&
      itemDate.getMonth() === currentDate.getMonth() &&
      itemDate.getFullYear() === currentDate.getFullYear()
    );
  });

  forecastList.forEach((item) => {
    let itemDate = new Date(item.dt * 1000);
    let formatedDate = formatDate(itemDate);
    if (!weathers.find((weather) => weather.date === formatedDate)) {
      weathers.push({
        date: formatedDate,
        weather: [
          {
            ...item,
            hours: itemDate.getHours(),
          },
        ],
      });
    } else {
      let weather = weathers.find((weather) => weather.date === formatedDate);
      weather.weather.push({
        ...item,
        hours: itemDate.getHours(),
      });
    }
  });

  return weathers.map((weather) => {
    let minTemp = Math.min(
      ...weather.weather.map((item) => item.main.temp_min)
    );
    let maxTemp = Math.max(
      ...weather.weather.map((item) => item.main.temp_max)
    );

    const mostFrequentIcon = getMostFrequentIcon(weather.weather);

    return {
      date: weather.date,
      minTemp:
        unit === "imperial"
          ? convertCelsiusToFahrenheit(minTemp)
          : Math.round(minTemp),
      maxTemp:
        unit === "imperial"
          ? convertCelsiusToFahrenheit(maxTemp)
          : Math.round(maxTemp),
      imgUrl: formatImgUrl(mostFrequentIcon),
    };
  });
};

const getMostFrequentIcon = (data) => {
  const iconCounts = {};
  let maxCount = 0;
  let mostFrequentIcon = null;
  let iconAt12Hours = null;

  data.forEach((item) => {
    if (item.hours === 14) {
      iconAt12Hours = item.weather[0].icon;
    }

    const icon = item.weather[0].icon;

    if (!iconCounts[icon]) {
      iconCounts[icon] = 0;
    }

    iconCounts[icon]++;

    if (iconCounts[icon] > maxCount) {
      maxCount = iconCounts[icon];
      mostFrequentIcon = icon;
    } else if (iconCounts[icon] === maxCount) {
      mostFrequentIcon = null;
    }
  });

  return mostFrequentIcon || iconAt12Hours;
};

const formatCurrentWeather = (currentWeather, unit) => {
  let current = {};
  current.weather =
    currentWeather.weather && currentWeather.weather.length
      ? firstLetterCapitalized(currentWeather.weather[0].description)
      : null;
  current.windSpeed =
    currentWeather.wind && currentWeather.wind.speed
      ? convertMetersPerSecondToKilometersPerHour(currentWeather.wind.speed)
      : null;
  current.windDegree = currentWeather.wind && currentWeather.wind.deg;
  current.windDirection =
    currentWeather.wind && currentWeather.wind.deg
      ? convertWindDegreesToDirection(currentWeather.wind.deg)
      : null;
  current.humidity = currentWeather.main && currentWeather.main.humidity;
  current.visibility = currentWeather.visibility
    ? currentWeather.visibility / 1000
    : null;
  current.pressure = currentWeather.main && currentWeather.main.pressure;
  let tempeature = currentWeather.main && currentWeather.main.temp;
  current.temperature =
    unit === "imperial"
      ? convertCelsiusToFahrenheit(tempeature)
      : Math.round(tempeature);
  current.imgUrl =
    currentWeather.weather && currentWeather.weather.length
      ? formatImgUrl(currentWeather.weather[0].icon)
      : null;

  return current;
};
const firstLetterCapitalized = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
const convertMetersPerSecondToKilometersPerHour = (metersPerSecond) => {
  return Math.round(metersPerSecond * 3.6);
};
const convertWindDegreesToDirection = (degrees) => {
  const coords = [
    { label: "N", degreeLimit: 0 },
    { label: "NNE", degreeLimit: 22.5 },
    { label: "NE", degreeLimit: 45 },
    { label: "ENE", degreeLimit: 67.5 },
    { label: "E", degreeLimit: 90 },
    { label: "ESE", degreeLimit: 112.5 },
    { label: "SE", degreeLimit: 135 },
    { label: "SSE", degreeLimit: 157.5 },
    { label: "S", degreeLimit: 180 },
    { label: "SSO", degreeLimit: 202.5 },
    { label: "S0", degreeLimit: 225 },
    { label: "0S0", degreeLimit: 247.5 },
    { label: "0", degreeLimit: 270 },
    { label: "0N0", degreeLimit: 292.5 },
    { label: "N0", degreeLimit: 315 },
    { label: "NN0", degreeLimit: 337.5 },
    { label: "N", degreeLimit: 360 },
  ];

  const normalizedDegrees = ((degrees % 360) + 360) % 360;

  for (let i = 0; i < coords.length; i++) {
    const currentCoord = coords[i];
    const nextCoord = coords[i + 1];
    if (currentCoord.degreeLimit <= normalizedDegrees) {
      if (nextCoord.degreeLimit > normalizedDegrees) {
        return currentCoord.label;
      }
    }
  }

  return "N";
};

const formatImgUrl = (icon) => {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
};

const formatDate = (dateTime) => {
  const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
  const monthNames = [
    "Jan",
    "Fév",
    "Mar",
    "Avr",
    "Mai",
    "Juin",
    "Juil",
    "Août",
    "Sep",
    "Oct",
    "Nov",
    "Déc",
  ];

  const day = dayNames[dateTime.getDay()];
  const date = dateTime.getDate();
  const month = monthNames[dateTime.getMonth()];

  return `${day}, ${date} ${month}`;
};

const convertCelsiusToFahrenheit = (celsius) => {
  return Math.round(celsius * (9 / 5) + 32);
};
