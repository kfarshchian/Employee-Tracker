const inquirer = require('inquirer');
const fs = require('fs');
const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

var term = require( 'terminal-kit' ).terminal ;

const cTable = require('console.table');

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: process.env.MYSQL_RUN,
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
);


// GIVEN a command-line application that accepts user input
// WHEN I start the application
// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids
// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database
// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database

// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database

// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database

const dashboardQuetions = () =>{ 
    return inquirer.prompt([
      {
        type: 'list',
        name: 'initialQuestion',
        message: 'Welcome to the employee database. What Can I help you with today?',
        choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role']
    },
    ])
.then((data) => {
  console.log(data);
  
  if (data.initialQuestion === 'view all departments') {
    term.bold.underline.brightMagenta("All Departments.\n\n");
    db.query('SELECT * FROM departments;', function (err, results) {
      const allDepartments = [];
      allDepartments.push(results)
      console.table(results);
      return init();
    });    
      }
  else if (data.initialQuestion === 'view all roles'){
    term.bold.underline.brightMagenta("All Roles.\n\n");
    db.query('SELECT * FROM roles;', function (err, results) {
      const allRoles = [];
      allRoles.push(results)
      console.table(results);
      return init();
    });  
  }
  else if (data.initialQuestion === 'view all employees'){
    term.bold.underline.brightMagenta("All Employees.\n\n");
    db.query('SELECT * FROM employees left JOIN roles ON roles.id = employees.id;', function (err, results) {
      const allEmployees = [];
      allEmployees.push(results)
      console.table(results);
      return init();
    });  
  }
  else if (data.initialQuestion === 'add a department'){
    return inquirer.prompt([
      {
        type: 'Type',
        name: 'name',
        message: 'What is the name of the department you are adding?',
       },
    ])
    .then((data) =>{
      console.log(data);
      const newDepartment = data.addDepartment;
      db.query('INSERT INTO departments (department_name) VALUES (?);', newDepartment, function (err, results) {
        term.bold.underline.brightMagenta("New department added, please see below.\n\n");
        db.query('SELECT * FROM departments;', function (err, results) {
          const allEmployees = [];
          allEmployees.push(results)
          console.table(results);
          return init();})
      });
    }
  )
}
else if (data.initialQuestion === 'add a role'){
  return inquirer.prompt([
    {
      type: 'Type',
      name: 'addRole',
      message: 'What is the name of the role you are adding?',
     },
     {
      type: 'Number',
      name: 'salary',
      message: 'What is the starting salary for the role?',
     },
     {
      type: 'list',
      name: 'getDepartment',
      message: 'What department is the new role under"Information Systems = 1" "Accounting = 2" "HR = 3")',
      choices: [1, 2, 3]
    },
  ])
  .then((data) =>{
    console.log(data);
    const newRole = [data.addRole,parseInt(data.salary),data.getDepartment]
    db.query('INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?);', newRole, function (err, results) {
      term.bold.underline.brightMagenta("New department added, please see below.\n\n");
      db.query('SELECT * FROM roles;', function (err, results) {
        const allEmployees = [];
        allEmployees.push(results)
        console.table(results);
        return init();})
    });
  }
)
}
else if (data.initialQuestion === 'add an employee'){
  return inquirer.prompt([
    {
      type: 'Type',
      name: 'firstName',
      message: 'What is the employees first name?',
     },
     {
      type: 'Type',
      name: 'LastName',
      message: 'What is the employees last name?',
     },
     {
      type: 'Type',
      name: 'role',
      message: 'What is the employees role?',
     },
     {
      type: 'boolean',
      name: 'getManager',
      message: 'Is this employee a manager?',
    },
  ])
  .then((data) =>{
    console.log(data);
    const newRole = [data.addRole,parseInt(data.salary),data.getDepartment]
    db.query('INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?);', newRole, function (err, results) {
      term.bold.underline.brightMagenta("New department added, please see below.\n\n");
      db.query('SELECT * FROM roles;', function (err, results) {
        const allEmployees = [];
        allEmployees.push(results)
        console.table(results);
        return init();})
    });
  }
)
};
  
  

})

};


function init() {
    dashboardQuetions()
}

init();