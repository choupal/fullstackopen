require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
const { response } = require("express");

app.use(cors());
app.use(express.json());
app.use(express.static("build"));

morgan.token("body", function (req) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

// Get the list of persons
app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((persons) => res.send(persons))
    .catch((error) => next(error));
});

// Get infos about the phonebook
app.get("/info", (req, res, next) => {
  Person.find({}).then((persons) => {
    const date = new Date();
    res
      .send(
        `
    <p>Phonebook has info on ${persons.length} persons</p>
    <p>${date}</p>
    `
      )
      .catch((error) => next(error));
  });
});

// Get info about a specific person
app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => res.json(person))
    .catch((error) => next(error));
});

// Delete a specific person
app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => res.status(204).end())
    .catch((error) => next(error));
});

// Add a new person
app.post("/api/persons", (req, res, next) => {
  const body = req.body;
  const newPerson = new Person({
    name: body.name,
    number: body.number,
  });
  newPerson
    .save()
    .then((person) => {
      res.json(person);
    })
    .catch((error) => next(error));
});

// Modify a person
app.put("/api/persons/:id", (req, res, next) => {
  const person = {
    number: req.body.number,
  };

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

// Manage unknown routes
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

// Error Handling
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};
app.use(errorHandler);

// Server Setup
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});
