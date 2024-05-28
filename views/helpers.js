

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

const generateRandomString = () => {
  const alphaNumerical = '4535370043adfoighfodghpoashgposdhfgoxyzAPOHOPHPOHPOIHPOHO';
  let result = '';
  for (let i = 0; i < 9; i++) {
    result += alphaNumerical.charAt(Math.floor(Math.random() * alphaNumerical.length));
  }
  return result;
};

const findPassword = (email, database) => {
  for (let key in database) {
    if (email === database[key].email) {
      return database[key].password;
    }
  }
  return undefined;
};

const findUserID = (email, database) => {
  for (let key in database) {
    if (email === database[key].email) {
      return database[key].id;
    }
  }
  return undefined;
};





//Exporting functions
module.exports = { generateRandomString,findEmail, findPassword, findUserID, urlsForUser , getUserByEmail };