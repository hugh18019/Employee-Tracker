const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '1829Tj19sql',
    database: 'employee_db',
  },
  console.log(`Connect to the employeelist database.`)
);

// Query database
// db.query('SELECT * FROM department', function (err, results) {
//   console.log(results);
// });

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

///////////////////////////////Inquirer Prompts///////////////////////////////////
function firstPrompt() {
  return new Promise((resolve, reject) => {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'newQuery',
          message: 'What would you like to do?',
          choices: ['Add department', 'Add role', 'Add employee'],
        },
      ])
      .then((answer) => {
        resolve(answer);
      });
  });
}

firstPrompt();
