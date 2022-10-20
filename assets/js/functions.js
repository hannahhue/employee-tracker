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
        "Update Existing Employee",
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
      } else if (response.directory === "Update Existing Employee") {
        editEmployee();
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
    man.first_name AS manager
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
  inquirer
    .prompt({
      type: "input",
      message: "What is your Department?",
      name: "departmentName",
    })
    .then((response) => {
      db.query(
        `INSERT INTO department(department_name)
        VALUES ("${response.departmentName}")`,
        function (err, result) {
          if (err) {
            console.log(err);
          }
          viewDepartments();
        }
      );
    });
}

function addRoles() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is your Role?",
        name: "roleName",
      },
      {
        type: "input",
        message: "What is your Department ID?",
        name: "departmentName",
      },
      {
        type: "input",
        message: "What is your Salary?",
        name: "salary",
      },
    ])
    .then((response) => {
      db.query(
        `INSERT INTO employee_role(title, salary, department_id)
          VALUES ("${response.roleName}", ${response.salary}, ${response.departmentName})`,
        function (err, result) {
          if (err) {
            console.log(err);
          }
          viewRoles();
        }
      );
    });
}

function addEmployees() {
  inquirer
    .prompt([
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
        message: "What is your Role ID?",
        name: "roleName",
      },
      {
        type: "input",
        message: "What is your Manager's ID?",
        name: "manId",
      },
    ])
    .then((response) => {
      db.query(
        `INSERT INTO employee (first_name, last_name, role_id, manager_id)
        VALUES ("${response.firstName}", "${response.lastName}", ${response.roleName},${response.manId})`,
        function (err, result) {
          if (err) {
            console.log(err);
          }
          viewEmployees();
        }
      );
    });
}

function editEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the Employees ID?",
        name: "employeeId",
      },
      {
        type: "input",
        message: "What is their new Role ID?",
        name: "roleId",
      },
    ])
    .then((response) => {
      db.query(
        `UPDATE employee
        SET role_id = ${response.roleId}
        WHERE employee.id = ${response.employeeId}`,
        function (err, result) {
          if (err) {
            console.log(err);
          }
          viewEmployees();
        }
      );
    });
}

module.exports = { startPrompts };
