const inquirer = require("inquirer")

const mainMenu = {
        name: 'mainMenu',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
          { value: "addEmployee", name: "Add an Employee" },
          { value: "viewElement", name: "View Departments or Roles" },
          { value: "viewAllEmployees", name: "View all employees with department and role information" },
          { value: "updateSalary", name: "Change salary level of a role"},
          { value: "findManager", name: "Find the manager of an employee"},
          { value: "findMinions", name: "Find the minions of a manager"},
          { value: "deleteEmployee", name: "Remove an employee from the database" },
          { value: "calculateSalaryCosts", name: "Calculate salary costs by Role, Department or Total"},
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
    
const chooseResultLimiter = {
    name: 'limiter',
    type: 'list',
    message: 'Choose whether to view salaries by Role, Department or Total',
    choices: [
        { value: "role", name: "Salaries by ROLE"},
        { value: "department", name: "Salaries by DEPARTMENT"},
        { value: "total", name: "Sum of total business salary cost"},
        ]
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

const newEmployeeDetailsInit = (result) => {
    const question = [
        {
            name: 'newFirstName',
            type: 'input',
            message: "Please enter the new employee's FIRST NAME",
        },
        {
            name: "newLastName",
            type: "input",
            message: "Please enter the new employee's LAST NAME",
        },
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
        message: 'Choose a Department for the new employee',
        },]
    return question
}

const newEmployeeDetailsRole = (result) => {
    const question = [{
        name: 'roleId',
        type: 'rawlist',
        choices() {
            let choiceArray = [];
            result.forEach((item) => {
                let el = {value: item.id, name: item.title}
                choiceArray.push(el);
            });
            return choiceArray;
        },
        message: "Please select a role",
    }]
    return question
}

const chooseManager = (result) => {
    const question = [
        {
        name: 'managerId',
        type: 'rawlist',
        choices() {
            let choiceArray = [];
            result.forEach((item) => {
                let el = {value: item.id, name: `${item.first_name} ${item.last_name} working as ${item.title} in the ${item.name} department`}
                choiceArray.push(el);
            });
            return choiceArray;
        },
        message: 'Choose a person as the manager',
        },]
    return question
} 

const selectEmployeeToRemove = (result) => {
    const question = [
        {
        name: 'employeeId',
        type: 'rawlist',
        choices() {
            let choiceArray = [];
            result.forEach((item) => {
                let el = {value: item.id, name: `${item.first_name} ${item.last_name} working as ${item.title} in the ${item.name} department`}
                choiceArray.push(el);
            });
            return choiceArray;
        },
        message: 'Choose a person as the manager of this employee',
        },]
    return question
} 

const chooseDepartment = (result) => {
    question = [{
        name: 'departmentId',
        type: 'rawlist',
        choices() {
            let choiceArray = [];
            result.forEach((item) => {
                let el = {value: item.id, name: item.name}
                choiceArray.push(el);
            });
            return choiceArray;
        },
        message: 'Choose a Department for the new employee',
        },]
    return question
}

const choosePerson = (result) => {
    const question = [
        {
        name: 'personId',
        type: 'rawlist',
        choices() {
            let choiceArray = [];
            result.forEach((item) => {
                let el = {value: item.managerID, name: `${item.first_name} ${item.last_name} working as ${item.title} in the ${item.name} department`}
                choiceArray.push(el);
            });
            return choiceArray;
        },
        message: 'Choose a person to update details',
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
    newEmployeeDetailsInit,
    newEmployeeDetailsRole,
    chooseManager,
    selectEmployeeToRemove,
    chooseResultLimiter,
    chooseDepartment,
    choosePerson,
}