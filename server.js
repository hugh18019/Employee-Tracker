const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
var process = require('process');
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
// db.query(
//   'INSERT INTO department (id, department_name) VALUES (6, "Service");',
//   function (err, results) {
//     console.log(results);
//   }
// );

// db.query('SELECT * FROM department', function (err, results) {
//   console.log(results);
// });

// var salary = '2000';
// var department_id = '5';
// var title = 'bob';

// console.log(typeof salary);
// console.log(typeof department_id);

// var query = `INSERT INTO employee_role (title, salary, department_id)
// VALUES ("${title}", ${salary}, ${department_id} );`;
// db.query(query, function (err, results) {
//   console.log(`Added ${title} to the database.`);
// });

// db.query('SELECT * FROM employee_role', function (err, results) {
//   console.log(results);
// });

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  // console.log(`Server running on port ${PORT}`);
});

///////////////////////////////Inquirer Prompts///////////////////////////////////
function initialPrompt() {
  return new Promise((resolve, reject) => {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'newQuery',
          message: 'What would you like to do?',
          choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add department',
            'Add role',
            'Add employee',
            'Update an employee role',
            'Quit',
          ],
        },
      ])
      .then((answer) => {
        resolve(answer);
      });
  });
}

function promptForDepartment() {
  return new Promise((resolve, reject) => {
    inquirer
      .prompt([
        {
          name: 'department_name',
          message: 'What is the name of the department?',
          inputType: 'input',
        },
      ])
      .then((answer) => {
        resolve(answer);
      });
  });
}

function storeDepartment(department_name) {
  let query = `INSERT INTO department (department_name)
  VALUES ("${department_name}" );`;

  db.query(query, function (err, results) {
    console.log(`Added ${department_name} to the database`);
  });
}

async function promptForRole() {
  var choices = await getDepartmentNames();
  console.log(choices);

  return new Promise((resolve, reject) => {
    inquirer
      .prompt([
        {
          name: 'title',
          message: 'What is the name of the role?',
          inputType: 'input',
        },
        {
          name: 'salary',
          message: 'What is the salary of the role?',
          inputType: 'input',
        },
        {
          type: 'list',
          name: 'department',
          message: 'Which department does the role belong to?',
          choices: choices,
        },
      ])
      .then((answer) => {
        // console.log(answer);
        resolve(answer);
      });
  });
}

async function storeRole(roleObj) {
  let { title, salary, department } = roleObj;

  var department_id = await getDepartmentID(department);

  // console.log('department_id is: ', department_id[0].id);

  var query = `INSERT INTO employee_role (title, salary, department_id)
  VALUES ("${title}", ${salary}, ${department_id[0].id} );`;
  db.query(query, function (err, results) {
    console.log(`Added ${title} to the database.`);
  });

  db.query('SELECT * FROM employee_role', function (err, results) {
    console.log(results);
  });
}

// Used by the storeRole function
// Given a department name, returns its associated department id
function getDepartmentID(department) {
  return new Promise((resolve, reject) => {
    var queryForDeptId = `SELECT id FROM department WHERE department.department_name = "${department}";`;
    db.query(queryForDeptId, function (err, results) {
      department_id = results;
      // console.log('department_id is: ', department_id);
      resolve(department_id);
    });
  });
}

// Gets an array of department names so that the promptForRole function can use it.
function getDepartmentNames() {
  var choices = [];
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM department', function (err, results) {
      for (let each of results) {
        choices.push(each.department_name);
      }
      resolve(choices);
    });
  });
}

function promptForEmployee() {
  return new Promise((resolve, reject) => {
    inquirer
      .prompt([
        {
          name: 'first_name',
          message: 'What is the first name of the employee?',
          inputType: 'input',
        },
        {
          name: 'last_name',
          message: 'What is the last name of the employee?',
          inputType: 'input',
        },
        {
          name: 'role_id',
          message: 'What is the role id of the employee?',
          inputType: 'input',
        },
        {
          name: 'manager_id',
          message: "What is the id of the employee's manager?",
          inputType: 'input',
        },
      ])
      .then((answer) => {
        resolve(answer);
      });
  });
}

function storeEmployee(employee) {
  var { first_name, last_name, role_id, manager_id } = employee;

  var query = `INSERT INTO employee( first_name, last_name, role_id, manager_id)
  VALUES ("${first_name}", "${last_name}", ${role_id}, ${manager_id} )`;
  db.query(query, function (err, results) {
    console.log(`Added ${first_name} ${last_name} to the database.`);
  });

  db.query('SELECT * FROM employee', function (err, results) {
    console.log(results);
  });
}

function viewAllDepartments() {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM department', function (err, results) {
      console.log(results);
      resolve(results);
    });
  });
}

function viewAllRoles() {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM employee_role', function (err, results) {
      console.log(results);
      resolve(results);
    });
  });
}

function viewAllEmployees() {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM employee', function (err, results) {
      console.log(results);
      resolve(results);
    });
  });
}

async function init() {
  var done = false;
  var answer;
  while (!done) {
    var task = await initialPrompt();
    switch (task.newQuery) {
      case 'View all departments':
        await viewAllDepartments();
        break;
      case 'View all roles':
        await viewAllRoles();
        break;
      case 'View all employees':
        await viewAllEmployees();
        break;
      case 'Add department':
        answer = await promptForDepartment();
        storeDepartment(answer.department_name);
        break;
      case 'Add role':
        answer = await promptForRole();
        storeRole(answer);
        break;
      case 'Add employee':
        answer = await promptForEmployee();
        storeEmployee(answer);
        break;

      case 'Quit':
        done = true;
        break;
    }
  }
  process.exit(0);
}

init();
