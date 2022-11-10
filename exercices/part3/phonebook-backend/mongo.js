const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://choupal:${password}@cluster0.0b2ldvk.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
});

const Person = mongoose.model("Persons", personSchema);

mongoose.connect(url).then((result) => {
  const newPerson = new Person({
    name,
    number,
  });

  if (name && number) {
    newPerson.save().then((result) => {
      console.log(
        `added ${newPerson.name} number ${newPerson.number} to phonebook`
      );
      mongoose.connection.close();
    });
  } else {
    Person.find({}).then((result) => {
      result.forEach((person) => console.log(person));
      mongoose.connection.close();
    });
  }
});
