const express = require('express');
const mysql = require('mysql2');
// const bluebird = require('bluebird');
const inquirer = require('inquirer');
var process = require('process');
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let db;

db = mysql.createConnection(
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

async function promptForEmployee() {
  var roles = await viewAllRoles();
  var roleList = [];
  for (let each of roles) {
    roleList.push(each.title);
  }

  var managers = await viewAllEmployees();
  var managerList = [];
  for (let each of managers) {
    managerList.push(each.last_name);
  }

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
          type: 'list',
          name: 'role',
          message: "What is the employee's role?",
          choices: roleList,
        },
        {
          type: 'list',
          name: 'manager',
          message: "Who is the employee's manager?",
          choices: managerList,
        },
      ])
      .then((answer) => {
        resolve(answer);
      });
  });
}

async function storeEmployee(employee) {
  var { first_name, last_name, role, manager } = employee;
  var role_id;
  var manager_id;

  // Use the role and manager variables to get role_id and manager_id
  await db
    .promise()
    .query(`SELECT id FROM employee_role WHERE title = "${role}";`)
    .then(([rows, fields]) => {
      console.log(rows);
      role_id = rows[0].id;
      console.log(role_id);
    })
    .catch(console.log);
  // .then(() => db.end());

  await db
    .promise()
    .query(`SELECT role_id FROM employee WHERE last_name = "${manager}";`)
    .then(([rows, fields]) => {
      console.log(rows);
      manager_id = rows[0].id;
      console.log(manager_id);
    })
    .catch(console.log);
  // .then(() => db.end());

  // var query = `INSERT INTO employee( first_name, last_name, role_id, manager_id)
  // VALUES ("${first_name}", "${last_name}", ${role_id}, ${manager_id} )`;
  // db.query(query, function (err, results) {
  //   console.log(`Added ${first_name} ${last_name} to the database.`);
  // });

  // db.query('SELECT * FROM employee', function (err, results) {
  //   console.log(results);
  // });
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
        await storeEmployee(answer);
        break;
      case 'Update an employee role':
        await updateEmployeeRole();
      case 'Quit':
        done = true;
        break;
    }
  }
  process.exit(0);
}

init();
