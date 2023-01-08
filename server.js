// not related to express only the server
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

// Express
// console.log(app.get('env'));
// console.log(process.env);
const port = process.env.PORT || 3000;
// Start Server
app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
