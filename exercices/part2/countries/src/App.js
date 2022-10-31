import axios from "axios";
import { useEffect, useState } from "react";
import Countries from "./components/Countries";
import Filter from "./components/Filter";
function App() {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");
  const [show, setShow] = useState(false);
  const [showedCountry, setShowedCountry] = useState();

  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all").then((response) => {
      setCountries(response.data);
    });
  }, []);

  const handleFilterChange = (event) => {
    setFilter(event.target.value.toLowerCase());
    setShow(false);
    setShowedCountry(null);
  };

  let filteredCountries = filter
    ? countries.filter((country) =>
        country.name.common.toLowerCase().match(filter)
      )
    : countries;

  const handleShowButton = (country) => {
    setShow(true);
    setShowedCountry(country);
  };

  return (
    <>
      <Filter handleFilterChange={handleFilterChange} />
      <Countries
        filteredCountries={filteredCountries}
        handleShowButton={handleShowButton}
        show={show}
        showedCountry={showedCountry}
      />
    </>
  );
}

export default App;
