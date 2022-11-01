const Persons = ({ persons, deletePerson }) => {
  return (
    <>
      <h2>Numbers</h2>
      {persons.map((person) => (
        <li key={person.name}>
          {person.name} {person.number}
          <button onClick={() => deletePerson(person.id, person.name)}>
            delete
          </button>
        </li>
      ))}
    </>
  );
};

export default Persons;
