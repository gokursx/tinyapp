
//Importing bcrypt functionality
const bcrypt = require('bcryptjs');

//Initializing salt variable
const salt = 10;

//Creating urlDatabase object
const urlDatabase = {
  "9sm5xK": {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  "b2xVn2": {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

//Creating user object
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("2", salt)
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("2", salt)
  },
};

module.exports = {urlDatabase, users}