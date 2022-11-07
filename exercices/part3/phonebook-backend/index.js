const express = require("express");
const app = express();
const morgan = require("morgan");

app.use(express.json());

morgan.token("body", function (req) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

// Get the list of persons
app.get("/api/persons", (req, res) => res.send(persons));

// Get infos about the phonebook
app.get("/info", (req, res) => {
  const peopleInPhonebook = persons.length;
  const date = new Date();
  res.send(`
    <p>Phonebook has info on ${peopleInPhonebook} persons</p>
    <p>${date}</p>
`);
});

// Get info about a specific person
app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const foundPerson = persons.find((person) => person.id === id);
  if (foundPerson) {
    res.send(foundPerson);
  } else {
    res.status(404).end();
  }
});

// Delete a specific person
app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

// Add a new person
app.post("/api/persons", (req, res) => {
  const body = req.body;
  const foundPerson = persons.find((person) => person.name === body.name);

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "name or number missing",
    });
  } else if (foundPerson) {
    return res.status(400).json({
      error: "name already in phonebook",
    });
  } else {
    const newPerson = {
      id: Math.floor(Math.random() * 10000),
      name: body.name,
      number: body.number,
    };
    persons = persons.concat(newPerson);
    res.json(newPerson);
  }
});

// Manage unknown routes
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

// Server Setup
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});
