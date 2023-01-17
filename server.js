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
    await mongoose.set('strictQuery', true);
    const con = await mongoose.connect(DB);
    console.log('DB Connection Success');
    return con;
  } catch (error) {
    console.log(`DB Connection Failed : ${error}`);
  }
}

// Express
// console.log(app.get('env'));
// console.log(process.env);
const port = process.env.PORT || 3000;
// Start Server
const server = app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});

// listens to unhandledRejection
// ex. db connection, wrong password db, an error outside of our express
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled rejection. Shutting Down');
  server.close(() => {
    // 1- uncaught exception
    // shut down our app , since it will not gona work
    // abort all requrest that are currently still running
    // close the server and shutdown the application, gracefully
    // we have tools that listen to ccrashed and restart the server
    process.exit(1);
  });
});
