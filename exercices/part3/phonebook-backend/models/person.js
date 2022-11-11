const mongoose = require('mongoose')

// Connect to MongoDB
mongoose
  // eslint-disable-next-line no-undef
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('Connecting to MongoDB')
  })
  .catch((err) => console.log(err))

// Create person schema
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: {
      validator: function (v) {
        return /\d{2,3}-\d{6,10}/.test(v)
      },
    },
  },
})

// Modify the id format for personSchema
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

// Export the Person model based on the personSchema
module.exports = mongoose.model('Person', personSchema)
