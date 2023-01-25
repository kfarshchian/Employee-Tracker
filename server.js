const inquirer = require('inquirer');
const fs = require('fs');
const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: process.env.MYSQL_RUN,
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

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
  if (data == 'view all departments') {
    db.query('SELECT * FROM departments', function (err, results) {
      console.log(results);
      return init();
    });    
      }
})

};


// const viewDepartments = () => {
  
//   db.query('SELECT * FROM departments', function (err, results) {
//     console.log(results);
//   });

//   return dashboardQuetions();

// }




function init() {
    dashboardQuetions()
}

init();