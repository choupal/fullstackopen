import Country from "./Country";

const Countries = ({
  filteredCountries,
  handleShowButton,
  show,
  showedCountry,
}) => {
  if (filteredCountries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  } else if (filteredCountries.length === 1) {
    return <Country country={filteredCountries[0]} />;
  } else if (show) {
    return <Country country={showedCountry} />;
  } else {
    return filteredCountries.map((country) => (
      <li key={country.cca3}>
        {country.name.common}
        <button onClick={() => handleShowButton(country)}>Show</button>
      </li>
    ));
  }
};

export default Countries;
