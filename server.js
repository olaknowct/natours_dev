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
// Express
// console.log(app.get('env'));
// console.log(process.env);
const port = process.env.PORT || 3000;
// Start Server
app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
