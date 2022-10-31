import Weather from "./Weather";

const Country = ({ country }) => {
  return (
    <>
      <h1>{country.name.common}</h1>
      <p>Capital : {country.capital}</p>
      <p>Area : {country.area}</p>
      <h4>Languages :</h4>
      <ul>
        {Object.values(country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={"Flag"} />
      <Weather country={country} />
    </>
  );
};

export default Country;
