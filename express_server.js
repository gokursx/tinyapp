//express_server.js
const express = require("express");
//importing bcryptjs
const bcrypt = require('bcryptjs');
const app = express();
const PORT = 8080; // default port 8080

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use((req, res, next) => {
  req.session.user_id = "some value";
  next();
});
//Using cookie parser
const cookieParser = require('cookie-parser');

app.use(cookieParser());

const value = 10;
const password = "purple-monkey-dinosaur"; // found in the req.body object
const hashedPassword = bcrypt.hashSync(password, 10);
bcrypt.compareSync("purple-monkey-dinosaur", hashedPassword); // returns true
bcrypt.compareSync("pink-donkey-minotaur", hashedPassword); // returns false


const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

//Creating user object
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("2", value)
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("2", value)
  },
};

const urlsForUser = (id, database) => {
  const userURLs = {};
  for (let url in database) {
    if (id === database[url].userID) {
      userURLs[url] = database[url];
    }
  }
  return userURLs;
};

//Function to find user email
const findEmail = (email, database) => {
  for (let key in database) {
    if (email === database[key].email) {
      return email;
    }
  }
  return undefined;
};

//Function to get user by using email ID
const getUserByEmail = (email, database) => {
  // Iterate through keys in database
  for (let key in database) {
    // Condition to compare email entered
    if (database[key].email === email) {
      return database[key];
    }
  }
  return undefined;
};


//Using get method of express
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});


app.get('/urls', (req, res) => {
  const templateVars = { 
    user: req.session.user_id 
  };
  res.render('urls_index', templateVars);
});
// Ensure this route is before the /urls/:id to avoid conflict
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  const templateVars = { id, longURL };
  res.render("urls_show", templateVars);
});

app.get("/login", (req, res) => {
  const templateVars = {
    userID: null
  };
  res.render("login", templateVars);
});

// Start the server after all routes are defined
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

function generateRandomString() { }

app.get("/u/:id", (req, res) => {
  // const longURL = ...
  if (!urlDatabase[req.params.id]) {
    return res.send("longurl does not exist");
  }
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

app.get('/urls', (req, res) => {
  const templateVars = { 
    user: req.session.user_id 
  };
  res.render('urls_index', templateVars);
});

app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id]
  };
  res.render("register", templateVars);
});

//Using post method of express
app.post('/urls/:url_id/delete', (req, res) => {
  // Log the POST request body to the database
  console.log(urlDatabase[req.params.shortURL].userID);
  if (urlDatabase[req.params.shortURL].userID === req.session.user_id) {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  } else {
    res.status(403).send("Error");
  }
});

app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  res.send("Ok");
});



app.post("/urls/:id", (req, res) => {
  if (urlDatabase[req.params.id].userID === req.session.user_id) {
    let longURL = req.body.longURL;
    urlDatabase[req.params.id].longURL = longURL;
    res.redirect('/urls');
  } else {
    res.status(403).send("Error");
  }
});

//Login route
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const userEmail = findEmail(email, users);
  const userPassword = findPassword(email, users);
  if (email === userEmail) {
    if (bcrypt.compareSync(password, userPassword)) {
      const userID = findUserID(email, users);
      // Cookie for user ID
      res.cookie('user_id', authenticatedUser.id)
      req.session.user_id = userID;
      res.redirect("/urls");
    } else {
      res.status(403).send("Password is wrong");
    }
  } else {
    res.status(403).send("Register on the portal");
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id')
  res.redirect("/urls");
});

//Creating endpoint for user registration with email, and password
app.post("/register", (req, res) => {
  const newUserID = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  const userObj = {
    id: newUserID,
    email: email,
    password: bcrypt.hashSync(password, value)
  };
  const userEmail = findEmail(email, users);
  if (userObj.email === "" || userObj.password === "") {
    res.status(400).send("This is a 400 error: Provide Information");
  } else if (!userEmail) {
    users[newUserID] = userObj;
    // Cookie for user ID
    res.cookie('user_id', newUserID)
    res.redirect("/urls");
  } else {
    res.status(400).send("This is a 400 error : Login to continue");
  }
});