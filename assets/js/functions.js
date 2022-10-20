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
    `SELECT department.department_name AS department
    FROM department`,
    function (err, results) {
      if (err) {
        console.error(err);
      }
      console.table(results);
      startPrompts();
    }
  );
}

function viewRoles() {
  db.query(
    `SELECT employee_role.title AS role,
    department.department_name AS department,
    employee_role.salary AS salary
    FROM employee_role
    INNER JOIN department
    ON employee_role.department_id = department.id`,
    function (err, results) {
      if (err) {
        console.error(err);
      }
      console.table(results);
      startPrompts();
    }
  );
}

function viewEmployees() {
  db.query(
    `SELECT employee.first_name AS first,
    employee.last_name AS last,
    employee_role.title AS role,
    employee_role.salary AS salary,
    employee.first_name AS manager
    FROM employee
    LEFT JOIN employee man
    ON employee.manager_id = man.id
    INNER JOIN employee_role
    ON employee.role_id = employee_role.id
    `,
    function (err, results) {
      if (err) {
        console.error(err);
      }
      console.table(results);
      startPrompts();
    }
  );
}

function addDepartments() {
  inquirer.prompt({
    type: "input",
    message: "What is your Department?",
    name: "departmentName",
  });
  startPrompts();
}

function addRoles() {
  inquirer.prompt(
    {
      type: "input",
      message: "What is your Role?",
      name: "roleName",
    },
    {
      type: "input",
      message: "What is your Department?",
      name: "departmentName",
    },
    {
      type: "input",
      message: "What is your Salary?",
      name: "salary",
    }
  );
  startPrompts();
}

function addEmployees() {
  inquirer.prompt(
    {
      type: "input",
      message: "What is your First Name?",
      name: "firstName",
    },
    {
      type: "input",
      message: "What is your Last Name?",
      name: "lastName",
    },
    {
      type: "input",
      message: "What is your Role?",
      name: "roleName",
    },
    {
      type: "input",
      message: "What is your Manager's ID?",
      name: "manId",
    }
  );
  startPrompts();
}

module.exports = { startPrompts };
