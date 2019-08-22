const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
  useNewUrlParser: true,
  userCreateIndex: true,
  useFindAndModify: false
}).then(() => console.log('DB connection successful'));

// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded!');

  } catch(err){
    console.log(err)
  }
    process.exit();
};

// DELETE ALL DATA FROM DB/COLLECTION
const deleteData = async () => {
  try{
    await Tour.deleteMany();
    console.log('Data successfully deleted');

  } catch(err){
    console.log(err);
  }
  process.exit();
};

if(process.argv[2] === '--import'){
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
console.log(process.argv);

// in the terminal send the following:
//    C:\Users\sherry\Desktop\JONASNODE\natours> node dev-data/data/import-dev-data.js
// TO DELETE send the following:
// C:\Users\sherry\Desktop\JONASNODE\natours> node dev-data/data/import-dev-data.js --delete
