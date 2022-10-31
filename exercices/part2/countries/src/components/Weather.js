import { useEffect, useState } from "react";
import axios from "axios";

const Weather = ({ country }) => {
  const api_key = process.env.REACT_APP_API_KEY;
  const api_call = `http://api.openweathermap.org/data/2.5/weather?q=${country.capital}&units=metric&appid=${api_key}`;

  const [meteo, setMeteo] = useState();

  useEffect(() => {
    axios.get(api_call).then((response) => {
      setMeteo(response.data);
    });
  }, [api_call]);

  return (
    <>
      <h2>Weather in {country.capital}</h2>
      <p>Temperature : {meteo?.main.temp}°C</p>
      <img
        src={`http://openweathermap.org/img/wn/${meteo?.weather[0].icon}@2x.png`}
        alt={"meteo icon"}
      />
      <p>Wind : {meteo?.wind.speed} m/s</p>
    </>
  );
};

export default Weather;
