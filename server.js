const inquirer = require("inquirer");
const fs = require("fs");
const express = require("express");
const mysql = require("mysql2");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

var term = require("terminal-kit").terminal;

const cTable = require("console.table");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: process.env.MYSQL_RUN,
    database: "employee_db",
  },
  console.log(`Connected to the employee_db database.`)
);

const dashboardQuetions = () => {
  return inquirer
    .prompt([
      {
        type: "list",
        name: "initialQuestion",
        message:
          "Welcome to the employee database. What Can I help you with today?",
        choices: [
          "view all departments",
          "view all roles",
          "view all employees",
          "add a department",
          "add a role",
          "add an employee",
          "update an employee role",
        ],
      },
    ])
    .then((data) => {
      console.log(data);

      if (data.initialQuestion === "view all departments") {
        term.bold.underline.brightMagenta("All Departments.\n\n");
        db.query("SELECT * FROM departments;", function (err, results) {
          const allDepartments = [];
          allDepartments.push(results);
          console.table(results);
          return init();
        });
      } else if (data.initialQuestion === "view all roles") {
        term.bold.underline.brightMagenta("All Roles.\n\n");
        db.query("SELECT * FROM roles;", function (err, results) {
          const allRoles = [];
          allRoles.push(results);
          console.table(results);
          return init();
        });
      } else if (data.initialQuestion === "view all employees") {
        term.bold.underline.brightMagenta("All Employees.\n\n");
        db.query(
          "SELECT * FROM employees left JOIN roles ON roles.id = employees.id;",
          function (err, results) {
            const allEmployees = [];
            allEmployees.push(results);
            console.table(results);
            return init();
          }
        );
      } else if (data.initialQuestion === "add a department") {
        return inquirer
          .prompt([
            {
              type: "Type",
              name: "name",
              message: "What is the name of the department you are adding?",
            },
          ])
          .then((data) => {
            console.log(data);
            const newDepartment = data.addDepartment;
            db.query(
              "INSERT INTO departments (department_name) VALUES (?);",
              newDepartment,
              function (err, results) {
                term.bold.underline.brightMagenta(
                  "New department added, please see below.\n\n"
                );
                db.query("SELECT * FROM departments;", function (err, results) {
                  const allEmployees = [];
                  allEmployees.push(results);
                  console.table(results);
                  return init();
                });
              }
            );
          });
      } else if (data.initialQuestion === "add a role") {
        return inquirer
          .prompt([
            {
              type: "Type",
              name: "addRole",
              message: "What is the name of the role you are adding?",
            },
            {
              type: "Number",
              name: "salary",
              message: "What is the starting salary for the role?",
            },
            {
              type: "list",
              name: "getDepartment",
              message:
                'What department is the new role under "Information Systems = 1" "Accounting = 2" "HR = 3")',
              choices: [1, 2, 3],
            },
          ])
          .then((data) => {
            console.log(data);
            const newRole = [
              data.addRole,
              parseInt(data.salary),
              data.getDepartment,
            ];
            db.query(
              "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?);",
              newRole,
              function (err, results) {
                term.bold.underline.brightMagenta(
                  "New department added, please see below.\n\n"
                );
                db.query("SELECT * FROM roles;", function (err, results) {
                  const allEmployees = [];
                  allEmployees.push(results);
                  console.table(results);
                  return init();
                });
              }
            );
          });
      } else if (data.initialQuestion === "add an employee") {
        return inquirer
          .prompt([
            {
              type: "Type",
              name: "firstName",
              message: "What is the employees first name?",
            },
            {
              type: "Type",
              name: "lastName",
              message: "What is the employees last name?",
            },
            {
              type: "list",
              name: "role",
              message:
                'What is the employees role_id "Information Systems = 1" "Accounting = 2" "HR = 3"?',
              choices: [1, 2, 3],
            },
          ])
          .then((data) => {
            console.log(data);
            const newEmployee = [data.firstName, data.lastName, data.role];
            db.query(
              "INSERT INTO employees (first_name, last_name, roles_id) VALUES (?, ?, ?);",
              newEmployee,
              function (err, results) {
                term.bold.underline.brightMagenta(
                  "New employee added, please see below.\n\n"
                );
                db.query("SELECT * FROM employees;", function (err, results) {
                  const allEmployees = [];
                  allEmployees.push(results);
                  console.table(results);
                  return init();
                });
              }
            );
          });
      } else if (data.initialQuestion === "update an employee role") {
        db.query(
          "SELECT * FROM employees left JOIN roles ON roles.id = employees.id;",
          function (err, results) {
            const allEmployees = [];
            const allRoles = [];
            results.forEach((employee) => {
              allEmployees.push(
                `${employee.id} ${employee.first_name} ${employee.last_name}`
              );
            });
            results.forEach((employee) => {
              allRoles.push(`${employee.title}`);
            });
            console.table(allEmployees);
            console.table(allRoles);
            return inquirer
              .prompt([
                {
                  type: "list",
                  name: "updateEmployee",
                  message: "What employee would you like to update?",
                  choices: allEmployees,
                },
                {
                  type: "list",
                  name: "roleSelection",
                  message: "What role is the employee switching to?",
                  choices: allRoles,
                },
              ])
              .then((data) => {
                console.log(data.roleSelection);
                db.query(
                  "Update roles SET title = ? where id = ?;",
                  [data.roleSelection, data.updateEmployee[0]],
                  function (err, results) {
                    term.bold.underline.brightMagenta(
                      "Employee role has been updated.\n\n"
                    );
                    db.query(
                      "SELECT * FROM employees left JOIN roles ON roles.id = employees.id;",
                      function (err, results) {
                        const allEmployees = [];
                        allEmployees.push(results);
                        console.table(results);
                        return init();
                      }
                    );
                  }
                );
              });
          }
        );
      }
    });
};

function init() {
  dashboardQuetions();
}

init();
