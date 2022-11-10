const mongoose = require("mongoose");

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URL)
  .then((result) => {
    console.log("Connecting to MongoDB");
  })
  .catch((err) => console.log(err));

// Create person schema
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

// Modify the id format for personSchema
personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

// Export the Person model based on the personSchema
module.exports = mongoose.model("Person", personSchema);
