// not related to express only the server
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// this one execute first before require app since from the app we are defining the env
dotenv.config({ path: './config.env' });

const app = require('./app');

// Replacing password
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

dbConnect();

async function dbConnect() {
  try {
    const con = await mongoose.connect(DB);
    console.log(con);
    return con;
  } catch (error) {
    console.log(error);
  }
}

// specifying + validation + describing the Schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A Tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

// Creating the model
const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
  name: 'The Forest Hiker',
  rating: 4.7,
  price: 497,
});

testTour
  .save()
  .then((doc) => console.log(doc))
  .catch((err) => console.log(err));
// Express
// console.log(app.get('env'));
// console.log(process.env);
const port = process.env.PORT || 3000;
// Start Server
app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
