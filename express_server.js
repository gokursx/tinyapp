const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

//Creating user object
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
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

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
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
    username: null
  };
res.render("urls_show", templateVars);
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

app.get("/urls", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
    // ... any other vars
  };
  res.render("urls_index", templateVars);
});




//Using post method of express
app.post('/urls/:url_id/delete', (req, res) => {
  // Log the POST request body to the database
  console.log(urlDatabase[req.params.shortURL].userID);
  if (urlDatabase[req.params.shortURL].userID === req.session["userID"]) {
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
  if (urlDatabase[req.params.id].userID === req.session["userID"]) {
    let longURL = req.body.longURL;
    urlDatabase[req.params.id].longURL = longURL;
    res.redirect('/urls');
  } else {
    res.status(403).send("Error");
  }
});

app.post("/login", (req, res) => {
  const userName = req.body.username;
  if (username = userName) {
    if (bcrypt.compareSync(username, userName)) {
      const userID = findUserID(username, users);
      res.cookie('name', 'tobi', { domain: '.example.com', path: '/admin', secure: true })
      req.session["userID"] = userID;
      res.redirect("/urls");
    } else {
      res.status(403).send("Password is wrong");
    }
  } else {
    res.status(403).send("Register on the portal");
  }
});

app.post("/logout", (req, res) => {
  req.session["userID"] = null;
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
    password: bcrypt.hashSync(password, saltRounds)
  };
  const userEmail = findEmail(email, users);
  if (userObj.email === "" || userObj.password === "") {
    res.status(400).send("400 error ! Please Provide Information");
  } else if (!userEmail) {
    users[newUserID] = userObj;
    req.session["userID"] = newUserID;
    res.redirect("/urls");
  } else {
    res.status(400).send("400 error ! Please Login");
  }
});