// not related to express only the server
const app = require('./app');
const port = 3000;
// Start Server
app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
