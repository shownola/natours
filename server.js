const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');


// console.log(process.env);
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

// mongoose.connect(DB, {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useFindAndModify: false
// }).then(con => {
//   // console.log(con.connections);
//   console.log('DB connection successful!');
// });
mongoose.connect(DB, {
  useNewUrlParser: true,
  userCreateIndex: true,
  useFindAndModify: false
}).then(() => console.log('DB connection successful'));
// see MongoDB.txt for local DB instr.

// START SERVER
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`)
});

// Handling rejections
process.on('unhandledRejection', err => {
  console.log(err.name, err.messsage);
  console.log('UNHANDLED REJECTION, shutting down...');
  server.close(() => {
      process.exit(1);
  });
});
