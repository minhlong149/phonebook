const mongoose = require("mongoose");

let displayPhoneBook = false;

switch (process.argv.length) {
  case 2:
    console.log(
      "Please provide the password as an argument: node mongo.js <password>"
    );
    process.exit(1);
  case 3:
    displayPhoneBook = true;
    break;
  case 4:
    // missing phone number
    console.log(
      "Please provide the phone number as an argument: node mongo.js <password> <name> <number>"
    );
    process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://admin:${password}@phonebookcluster.qzsbutc.mongodb.net/?retryWrites=true&w=majority`;

const personSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
});

const Person = mongoose.model("Person", personSchema);

mongoose
  .connect(url)
  .then(() => {
    if (displayPhoneBook) {
      return Person.find({}).then((persons) => {
        console.log("phonebook:");
        persons.forEach((person) => {
          console.log(`${person.name} ${person.phoneNumber}`);
        });
      });
    } else {
      const person = new Person({
        name: process.argv[3],
        phoneNumber: process.argv[4],
      });

      return person.save().then(() => {
        console.log(
          `added ${process.argv[3]} number ${process.argv[4]} to phonebook`
        );
      });
    }
  })
  .then(() => {
    return mongoose.connection.close();
  })
  .catch((err) => console.log(err));
