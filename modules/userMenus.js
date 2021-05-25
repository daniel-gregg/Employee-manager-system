const inquirer = require("inquirer")

const mainMenu = {
        name: 'mainMenu',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
          { value: "addElement", name: "Add a Department, Role, or Employee" },
          { value: "viewElement", name: "View Departments or Roles" },
          { value: "viewAllEmployees", name: "View all employees with department and role information" },
          { value: "updateRole", name: "Update an employee's role" },
          { value: "updateSalary", name: "Change salary level of a role"},
          { value: "deleteElement", name: "Remove an employee, role or department from the database" },
          { value: "exit", name: "Exit 'Employee-Manager-System'" }
        ]
}

const viewElements = {
    name: 'elementName',
    type: 'list',
    message: 'Departments',
    choices: [
      { value: "departments", name: "Departments by name" },
      { value: "roles", name: "Employee Roles by title" },
      { value: "employees", name: "Employees by name" }
    ],
  }

const viewDepartments = (result) => {
    const question = [
        {
        name: 'departmentName',
        type: 'rawlist',
        choices() {
            let choiceArray = [];
            result.forEach((item) => {
            choiceArray.push(item.name);
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
            { value: "roles", name: "Department Roles" },
            { value: "employees", name: "Department Employees" }
        ]
        },
    ]
    return question
} 
    
const updateEmployeesMain = (result) => {
    const question = [
        {
        name: 'personId',
        type: 'rawlist',
        choices() {
            let choiceArray = [];
            result.forEach((item) => {
                let el = {value: item.id, name: `${item.first_name} ${item.last_name} working as ${item.title} in the ${item.name} department`}
                choiceArray.push(el);
            });
            return choiceArray;
        },
        message: 'Choose a person to update details',
        },]
    return question
} 

const selectNewDepartment = (result,person) => {
    const question = [
    {
    name: 'departmentName',
    type: 'rawlist',
    choices() {
        let choiceArray = [];
        result.forEach((item) => {
        choiceArray.push(item.name);
        });
        return choiceArray;
    },
    message: `Choose a new department for ${person.first_name} ${person.last_name} working as ${person.title} in the ${person.name} department`,
    },]
    return question
}

const selectNewRole = (result,person) => {
    const question = [
    {
    name: 'roleName',
    type: 'rawlist',
    choices() {
        let choiceArray = [];
        result.forEach((item) => {
        choiceArray.push(item.title);
        });
        return choiceArray;
    },
    message: `Choose a new role for ${person.first_name} ${person.last_name} working as ${person.title} in the ${person.name} department`,
    },]
    return question
}

module.exports = {
    mainMenu,
    viewElements,
    viewDepartments,
    updateEmployeesMain,
    selectNewDepartment,
    selectNewRole,
}