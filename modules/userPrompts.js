const inquirer = require("inquirer")

//This is all from the 'great bay' auction process. 


// function which prompts the user for what action they should take
const start = () => {
    inquirer
    .prompt({
      name: 'mainMenu',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        {value: "addElement", name: "Add a Department, Role, or Employee"},
        {value: "viewElement", name: "View all Departments, Roles or Employees"},
        {value: "updateRole", name: "Update an employee's role"},
        {value: "exit", name: "Exit 'Employee-Manager-System'"}
      ]
    })
    .then((answer) => {
      // based on their answer, either call the bid or the post functions
      if (answer.mainMenu === 'addElement') {
        addElement();
      } else if (answer.mainMenu === 'viewElement') {
        viewElements();  //fix this later to go through a next step first
      } else  if (answer.mainMenu === 'updateRole'){
        updateRole();
      } else {
        connection.end();
      }
    });
}
  
const viewElements = () => {
  inquirer
  .prompt([
    {
      name: 'elementName',
      type: 'list',
      message: 'Departments',
      choices: [
        {value: "departments", name: "Departments by name"},
        {value: "roles", name: "Employee Roles by title"},
        {value: "employees", name: "Employees by name"}
      ],
    },
  ])
  .then((answer) => {
    if(answer.elementName === "departments"){
      viewDepartments()
    }
    //add view By Role and view Employees
  })
}

const viewDepartments = () => {
  connection.query('SELECT * FROM employeedb.departments', (err, results) => {
    if (err) throw err;
    inquirer
    .prompt([
      {
      name: 'departmentsList',
      type: 'list',
      choices() {
        const choiceArray = [];
        results.forEach(({ item_name }) => {
          choiceArray.push(item_name);
        });
        return choiceArray;
      },
      message: 'Choose a Department to view',
      },
      {
        name: 'elementName',
        type: 'list',
        message: "Would you like to view department roles or employees?",
        choices: [
          {value: "roles", name: "Department Roles"},
          {value: "employees", name: "Department Employees"}
        ]
      },
    ])
    .then((answer) => {
      if(answer.elementName === "roles"){
        rolesByDepartment()
      }
    })
  })
}
            
const rolesByDepartment = () => {
  connection.query(`
    SELECT roles.title 
    FROM roles 
    INNER JOIN departments ON roles.departmentID=departments.id;`, 
    (err, results) => {
      if (err) throw err;
      console.log(results)
    })
}
            

module.exports = {
  start,
  viewDepartments,
  viewElements,
  rolesByDepartment,
}