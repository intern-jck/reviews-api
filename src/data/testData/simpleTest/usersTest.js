const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const usersCSV = './users.csv';

mongoose.connect('mongodb://localhost/users', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log(`MongoDB Connected!`);
  addUsers(usersCSV);
})
.catch((err) => {
  console.log(`MongoDB ERR ${err}`);
});


const userSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  movies: [
      {
          name: String,
          duration: Number,
          actors: [{ name: String, age: Number }]
      }
  ],
});

const Users = mongoose.model('Users', userSchema);

const addUsers = (csvPath) => {
  fs.createReadStream(path.resolve(__dirname, csvPath))
  .pipe(csv.parse({ headers: true }))
  .on('error', error => console.error(error))
  .on('data', (row) => {
    // let actor = {firstName: row.firstName, lastName: row.lastName};

    Users.findOneAndUpdate(
      {
      "firstName": row.firstName
      },
      {
        "firstName": row.firstName,
        "lastName": row.lastName
      },
      {
        useFindAndModify: false,
        new: true,
        upsert: true,
        overwrite: true,
      },
      (err, result) => {
        if(err) {console.log(err)}
        if(result) {console.log(result)}
      })
    })
  .on('end', (rowCount) => {
    console.log(`Added ${rowCount} rows`)
  });



}