// api/event_db.js
// MySQL connection for the charityevents_db database.
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '428328Han!',    // adjust to your local environment
  database: 'charityevents_db'
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL connected: charityevents_db');
});

module.exports = db;
