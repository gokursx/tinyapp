//express_server.js
const express = require("express");
//Importing express-session
const session = require('express-session');
//importing bcryptjs
const bcrypt = require('bcryptjs');
//Importing Helper functions from helpers.js module
const { generateRandomString, findEmail, findPassword, findUserID, urlsForUser} = require("./views/helpers.js");
const app = express();
const PORT = 8080; // default port 8080

app.use(express.urlencoded({ extended: true }));
// add this line
app.use(express.json());
app.set("view engine", "ejs");

app.use(session({
  secret: 'mySecretKey_2024!#$', // This secret will be used to sign the session ID cookie.
  resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request.
  saveUninitialized: false, // Forces a session that is "uninitialized" to be saved to the store.
}));


//Using cookie parser
const cookieParser = require('cookie-parser');

app.use(cookieParser());

const salt = 10;


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

//Using get method of express
app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get('/urls', (req, res) => {
  // Assuming you have a data structure for URLs that you want to pass to your template

  const userID = req.session.user_id;//req.session.user_id;
  //Uses helper function
  // const getUrl = function (urlDatabase) {
  //   const urlsForUser = {};
  //   for (let keys in urlDatabase) {
  //     const id = urlDatabase[keys].userID;
  //     if (id === userID) {
  //       urlsForUser[keys] = urlDatabase[keys].longURL;
  //     }
  //   }
  // }  
  // getUrl(urlDatabase);
  if (!req.session.user_id) {
    return res.status(400).send("Login in before go to the page");
  }
  console.log(urlsForUser);
  const urls = urlsForUser(userID,urlDatabase);

  // Pass this structure to your template like so:
  res.render('urls_index', { urls, user: users[req.session.user_id] })
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const urlObject = urlDatabase[shortURL];
  if (urlObject) {
    const longURL = urlObject.longURL;
    res.redirect(longURL);
  } else {
    // If the shortURL does not exist in the database, you can redirect to an error page or homepage
    // Or send an error message to the user
    res.status(404).send("The requested URL does not exist.");
  }
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: req.session.user_id
  };
  res.render('urls_new', templateVars);
  if (!req.session.user_id) {
    res.redirect("/login");
  }
})

app.get("/urls/:shortURL", (req, res) => {
  console.log("userid", req.session.user_id);
  if (!req.session.user_id) {
    res.status(400).send("400 error ! Please Login or Register");
  } else if (!urlDatabase[req.params.shortURL]) {
    res.status(404).send("404 not found! This URL doesn't exist");
  } else if (urlDatabase[req.params.shortURL].userID === req.session.user_id) {
    const templateVars = {
      id: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL,
      user: users[req.session.user_id]
    };
    res.render("urls_show", templateVars);
  } else if (urlDatabase[req.params.shortURL].userID !== req.session.user_id) {
    res.status(403).send("403 error ! This is not your URL");
  } else {
    res.status(400).send("400 error ! Please Login");
  }
});

app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id].longURL; // Corrected to reference the URL string
  const templateVars = { id, longURL };
  res.render("urls_show", templateVars);
});

//url_Login
app.get("/login", (req, res) => {
  const templateVars = {
    user: null
  };
  res.render("urls_login", templateVars);
});

app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id]
  };
  res.render("register", templateVars);
});

//Using post method of express
app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  console.log("This is short url", shortURL);
  console.log("this is userid", req.session.user_id);

  // Check if the shortURL exists in the database
  if (!urlDatabase[shortURL]) {
    return res.status(404).send("Short URL not found.");
  }

  // Check if the user has permission to delete the shortURL
  if (urlDatabase[shortURL].userID === req.session.user_id) {
    delete urlDatabase[shortURL];
    res.redirect("/urls");
  } else {
    res.status(403).send("Permission denied.");
  }
});

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const userID = req.session.user_id;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = { longURL, userID };
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:id", (req, res) => {
  console.log(urlDatabase);
  console.log(req.session.user_id)
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
  req.session.user_id = null;
  res.redirect("/login");
});

//Creating endpoint for user registration with email, and password
app.post("/register", (req, res) => {
  const newUserID = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  const userObj = {
    id: newUserID,
    email: email,
    password: bcrypt.hashSync(password, salt)
  };
  const userEmail = findEmail(email, users);
  if (email == userEmail) {
    res.status(400).send("This email already exists");
  }
  console.log(userEmail, users);
  if (userObj.email === "" || userObj.password === "") {
    res.status(400).send("This is a 400 error: Provide Information");
  } else if (!userEmail) {
    users[newUserID] = userObj;
    // Cookie for user ID
    req.session.user_id = newUserID;
    res.redirect("/urls");
  } else {
    res.status(400).send("This is a 400 error : Login to continue");
  }
});

// Start the server after all routes are defined
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

