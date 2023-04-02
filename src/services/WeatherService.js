export const initWeatherForAddress = (address) => {
  let weather = {
    current: null,
    forecast: null,
  };
  // current : https://api.openweathermap.org/data/2.5/weather?lat=45.2511306&lon=4.7281184&appid=6cb0c5274fc3d4ca476af2162ab5d713&units=metric&lang=fr
  const apiKey = import.meta.env.VITE_WEATHER_KEY;
};
