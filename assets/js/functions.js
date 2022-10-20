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

//creates list, always returns back here after prompts
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
    //giving direction to choice (what function to start)
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

//when selected view depart function start
function viewDepartments() {
  //grabs all department table
  db.query(
    `SELECT department.department_name AS department
    FROM department`,
    //catch error or go back to home list
    function (err, results) {
      if (err) {
        console.error(err);
      }
      console.table(results);
      startPrompts();
    }
  );
}

//when selected view roles function start
function viewRoles() {
  //grabs all roles from employee_roles,
  //and grabs from the other table with join
  db.query(
    `SELECT employee_role.title AS role,
    department.department_name AS department,
    employee_role.salary AS salary
    FROM employee_role
    INNER JOIN department
    ON employee_role.department_id = department.id`,
    //catch error or return home list
    function (err, results) {
      if (err) {
        console.error(err);
      }
      console.table(results);
      startPrompts();
    }
  );
}

//when selecting view employees
function viewEmployees() {
  //grabs all employee table and from other two tables
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
    //catch error or return home list
    function (err, results) {
      if (err) {
        console.error(err);
      }
      console.table(results);
      startPrompts();
    }
  );
}

//when selecting to add a department
function addDepartments() {
  //request info
  inquirer
    .prompt({
      type: "input",
      message: "What is your Department?",
      name: "departmentName",
    })
    .then((response) => {
      //take info givin and input into the values in seeds & show updated list
      db.query(
        `INSERT INTO department(department_name)
        VALUES ("${response.departmentName}")`,
        //catch error or return home list
        function (err, result) {
          if (err) {
            console.log(err);
          }
          viewDepartments();
        }
      );
    });
}

//when selecting to add new role
function addRoles() {
  //request info prompt
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
      //takes info and inputs into seed values
      db.query(
        `INSERT INTO employee_role(title, salary, department_id)
          VALUES ("${response.roleName}", ${response.salary}, ${response.departmentName})`,
        //catch error or return home list & show updated list
        function (err, result) {
          if (err) {
            console.log(err);
          }
          viewRoles();
        }
      );
    });
}

//when u select to add a new employee
function addEmployees() {
  //request info prompts
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
      //takes info and inputs it into the employee value seeds
      db.query(
        `INSERT INTO employee (first_name, last_name, role_id, manager_id)
        VALUES ("${response.firstName}", "${response.lastName}", ${response.roleName},${response.manId})`,
        //catch error or return updated table and home list
        function (err, result) {
          if (err) {
            console.log(err);
          }
          viewEmployees();
        }
      );
    });
}

//if u chose to edit a employee
function editEmployee() {
  //request info
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
      //update the role id per the employee id given
      db.query(
        `UPDATE employee
        SET role_id = ${response.roleId}
        WHERE employee.id = ${response.employeeId}`,
        //catch error or view updates and return to home list
        function (err, result) {
          if (err) {
            console.log(err);
          }
          viewEmployees();
        }
      );
    });
}

//interact with index.js
module.exports = { startPrompts };
