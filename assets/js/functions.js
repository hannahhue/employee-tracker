const inquirer = require("inquirer");
const mysql = require("mysql2");

//connecting to data base
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "password",
    database: "employee_db",
  },
  console.log(`Connected to the employee database.`)
);

function startPrompts() {
  inquirer
    .prompt({
      type: "list",
      choices: [
        "View Departments",
        "View Roles",
        "View Employees",
        "Add Departments",
        "Add Roles",
        "Add Employees",
        "Exit",
      ],
      message: "Where would you like to go?",
      name: "directory",
    })
    .then((response) => {
      if (response.directory === "View Departments") {
        viewDepartments();
      } else if (response.directory === "View Roles") {
        viewRoles();
      } else if (response.directory === "View Employees") {
        viewEmployees();
      } else if (response.directory === "Add Departments") {
        addDepartments();
      } else if (response.directory === "Add Roles") {
        addRoles();
      } else if (response.directory === "Add Employees") {
        addEmployees();
      } else {
        process.exit();
      }
    });
}

function viewDepartments() {
  db.query(
    `SELECT depatment.department_name AS department
    FROM department`,
    function (err, results) {
      if (err) {
        console.error(err);
      }
      console.table(results);
    }
  );
}

function viewRoles() {
  db.query(`SELECT employee_role.
    `);
}

function viewEmployees() {
  db.query(`SELECT 
    `);
}

function addDepartments() {
  db.query(`SELECT 
    `);
}

function addRoles() {
  db.query(`SELECT 
    `);
}

function addEmployees() {
  db.query(`SELECT 
    `);
}

module.exports = { startPrompts };
