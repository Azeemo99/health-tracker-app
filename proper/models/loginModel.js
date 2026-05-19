const fs = require('fs').promises;
const path = require('path');

const dataPath = path.join(__dirname, '../test.json');

async function getUsers() {
  try {
    const data = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading users file:', err);
    return [];
  }
}

async function verifyUser(username, password) {
  const users = await getUsers();

  // Check if a user exists with matching email and password
  const user = users.find(user => user.username === username && user.password === password);
  return user || null;
}

module.exports = { verifyUser };
