const mysql = require("mysql2");
require("dotenv").config();
const inquirer = require("inquirer")
const Table = require("easy-table")
const util = require("util");
const menus = require("./modules/userMenus");

const connection = mysql.createConnection({
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  //Run an inquirer script that links to a db updating module
  start()
});

// node native promisify
const query = util.promisify(connection.query).bind(connection);

// function which prompts the user for what action they should take
const start = async () => {
  const answers = await inquirer.prompt(menus.mainMenu)
  selectSecondMenu(answers)
}

const selectSecondMenu = (answers) => {
  if (answers.mainMenu === 'addElement') {
      addElement();
    } else if (answers.mainMenu === 'viewElement') {
      viewElements();  //fix this later to go through a next step first
    } else if (answers.mainMenu === 'viewAllEmployees') {
      viewAllEmployees()
    } else if (answers.mainMenu === 'updateRole') {
      updateRole();
    } else {
      connection.end();
    }
}

const viewElements = async () => {
  const answers = await inquirer.prompt(menus.viewElements)
  if (answers.elementName === "departments") {
    viewDepartments()
  }
  //add view By Role and view Employees
}

const viewDepartments = async() => {
  try{
    const result = await query('SELECT * FROM employeedb.departments')
    const answer = await inquirer.prompt(menus.viewDepartments(result))
    if (answer.elementName === "roles") {
      rolesByDepartment()
    } else {
      employeesByDepartment(answer.departmentName)
    }
  } catch (err) {
    throw err;
  }
}

const rolesByDepartment = async() => {
  try{
    const result = await query(`SELECT roles.id, roles.title FROM roles INNER JOIN departments ON roles.departmentID=departments.id;`)
    var t = new Table
    result.forEach((item) => {
      t.cell('Role ID', item.id)
      t.cell('Role Title', item.title)
      t.newRow()
    })
    console.log(t.toString())
    start()
  } catch (err) {
    throw err;
  }
}


const employeesByDepartment = async(departmentName) => {
  try {
    const result = await query(`
    SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name
    FROM departments
    INNER JOIN roles ON roles.departmentID = departments.id
    INNER JOIN employees ON employees.roleID = roles.id
    WHERE departments.name = ?`,
    [departmentName],)

    var t = new Table
    result.forEach((item) => {
      t.cell('Employee ID', item.id)
      t.cell('First Name', item.first_name)
      t.cell('Last Name', item.last_name)
      t.cell('Role Title', item.title)
      t.cell('Department', item.name)
      t.newRow()
    })

    //Print the results and return to start menu
    console.log(t.toString())
    start()

  } catch (err){
    if (err) throw err
  }
}

const viewAllEmployees = async() => {
  try {
    const result = await query(`
    SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name
    FROM departments
    INNER JOIN roles ON roles.departmentID = departments.id
    INNER JOIN employees ON employees.roleID = roles.id`)

    var t = new Table
    result.forEach((item) => {
      t.cell('Employee ID', item.id)
      t.cell('First Name', item.first_name)
      t.cell('Last Name', item.last_name)
      t.cell('Role Title', item.title)
      t.cell('Department', item.name)
      t.newRow()
    })
    console.log(t.toString())
    start()
  } catch(err) {
    if (err) throw err
  }
}


const updateRole = async() => {
  try{
    let result = await query(`
    SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name
    FROM departments
    INNER JOIN roles ON roles.departmentID = departments.id
    INNER JOIN employees ON employees.roleID = roles.id`)

    //select an employee first
    const person = await inquirer.prompt(menus.updateEmployeesMain(result))
    //returns person id
    personDetails = await query(`
    SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name
    FROM departments
    INNER JOIN roles ON roles.departmentID = departments.id
    INNER JOIN employees ON employees.roleID = roles.id
    WHERE employees.id = ?`,
    [person.personId],
    )

    //then choose new department using: 'you chose PERSON working as ROLE in DEPARTMENT, please select first select new department
    result = await query('SELECT * FROM employeedb.departments')
    const newDepartment = await inquirer.prompt(menus.selectNewDepartment(result,personDetails[0]))

    //then choose new role using: 'please select the new role for PERSON'
    result = await query(`
    SELECT roles.title
    FROM departments
    INNER JOIN roles ON roles.departmentID = departments.id
    WHERE departments.name = ?`,
    [newDepartment.departmentName],)
    const newRole = await inquirer.prompt(menus.selectNewRole(result,personDetails[0]))  

    //get foreign key references for department ID and role ID then add to person in employees table
    const roleID = await query(`
      SELECT roles.id, roles.title, roles.departmentID
      FROM roles
      WHERE roles.title = ?`,
      [newRole.roleName],
    )

    const departmentName = await query(`
      SELECT departments.name
      FROM departments
      LEFT JOIN roles ON roles.departmentID = departments.id
      WHERE roles.departmentID = ?`,
      [roleID[0].departmentID],)

    await query(`
      UPDATE employees 
      SET 
          roleID = ?
      WHERE
          employees.id = ?;`,
      [roleID[0].id, personDetails[0].id],
    )

    //log the result to console for the user to check their actions
    console.log(`${personDetails[0].first_name} ${personDetails[0].last_name} working as ${personDetails[0].title} in the ${personDetails[0].name} department has had their role updated to ${roleID[0].title} in the ${departmentName[0].name} department`)
    start()
  } catch(err){
    if(err) throw err;
  }
}


//TODO
/* 
createNewEmployee  //creates a new employee - calls 'createNewRole' if new role needed
createNewRole  //creates a new role - calls 'createNewDepartment' if new department needed
createNewDepartment

removeEmployee
removeRole  //needs to carry out removeEmployee if the role has employees
removeDepartment  //needs to carry out removeRole if the department has roles

//also:
getTotalSalary
getDepartmentSalaryTotals
getRoleSalaryTotals */
