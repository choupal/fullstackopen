import { useEffect, useState } from "react";
import Persons from "./components/Persons";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import phonebook from "./services/persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNum, setNewNum] = useState("");
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState(null);
  const [color, setColor] = useState("success");

  const messageTimout = () =>
    setTimeout(() => {
      setMessage(null);
      setColor("success");
    }, 5000);

  useEffect(() => {
    phonebook.getNumbers().then((initialPersons) => setPersons(initialPersons));
  }, []);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNum(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value.toLowerCase());
  };

  let filteredPersons = filter
    ? persons.filter((person) => person.name.toLowerCase().match(filter))
    : persons;

  const addName = (event) => {
    event.preventDefault();

    const foundDuplicate = persons.find((person) => person.name === newName);

    if (foundDuplicate) {
      if (
        window.confirm(
          `${newName} is already in the phonebook ! Replace with new number ?`
        )
      ) {
        const updatedPerson = { ...foundDuplicate, number: newNum };
        phonebook
          .updateNumber(foundDuplicate.id, updatedPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== foundDuplicate.id ? person : returnedPerson
              )
            );
            setMessage(`Updated ${newName} number !`);
            messageTimout();
          })
          .catch((error) => {
            setMessage(`"${newName}" was already removed from the server`);
            setColor("error");
            messageTimout();
            setPersons(
              persons.filter((person) => person.id !== foundDuplicate.id)
            );
          });
      }
    } else {
      const newPerson = {
        name: newName,
        number: newNum,
      };
      phonebook.addNumber(newPerson).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNewNum("");
        setMessage(`Added ${newName} number !`);
        messageTimout();
      });
    }
  };

  const deletePerson = (id, name) => {
    if (window.confirm(`Do you really want to delete ${name} ?`)) {
      phonebook.deleteNumber(id).then((response) => {
        if (response.status === 200) {
          setPersons(persons.filter((person) => person.id !== id));
          setMessage(`Deleted ${name}`);
          messageTimout();
        } else {
          setMessage("Something went wrong");
          setColor("error");
          messageTimout();
        }
      });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} color={color} />
      <Filter handleFilterChange={handleFilterChange} />
      <h2>Add a new number</h2>
      <PersonForm
        addName={addName}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <Persons persons={filteredPersons} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
