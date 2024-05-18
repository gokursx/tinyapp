

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

//Exporting functions
module.exports = {getUserByEmail};