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
  if (answers.mainMenu === 'addEmployee') {
      addNewEmployee();
    } else if (answers.mainMenu === 'viewElement') {
      viewElements();
    } else if (answers.mainMenu === 'viewAllEmployees') {
      viewAllEmployees()
    } else if (answers.mainMenu === 'updateRole') {
      updateRole();
    } else if (answers.mainMenu ==='updateSalary') {
      updateSalary(); //TODO
    } else if (answers.mainMenu ==='findManager') {
      getManager(); 
    } else if (answers.mainMenu ==='findMinions') {
      getMinions(); 
    } else if (answers.mainMenu ==='deleteEmployee') {
      removeEmployee(); 
    } else if (answers.mainMenu === 'calculateSalaryCosts') {
      calcSalaryCosts(); 
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

const addNewEmployee = async() => {
  try {
    let result = await query('SELECT * FROM employeedb.departments')
    let answer = await inquirer.prompt(menus.newEmployeeDetailsInit(result))

    //collect details
    const newFirstName = answer.newFirstName
    const newLastName = answer.newLastName
    const departmentName = answer.departmentName

    result = await query(`
      SELECT roles.id, roles.title 
      FROM roles 
      INNER JOIN departments ON roles.departmentID=departments.id
      WHERE departments.name = ?`,
      [departmentName],)
    answer = await inquirer.prompt(menus.newEmployeeDetailsRole(result))
    const roleId = answer.roleId

    const roleTitle = await query(`SELECT roles.title FROM roles WHERE roles.id = ?`,[roleId])
    console.log(roleTitle[0].title)

    //get manager for new employee
    result = await query(`
      SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name
      FROM departments
      INNER JOIN roles ON roles.departmentID = departments.id
      INNER JOIN employees ON employees.roleID = roles.id`
    )
    
    answer = await inquirer.prompt(menus.chooseManager(result))
    const managerId = answer.managerId
    const manager = await query(`SELECT employees.first_name, employees.last_name FROM employees WHERE employees.id = ?`,[managerId])

    //Insert employee into employees table
    await query(`
      INSERT INTO employees (first_name, last_name, roleID, managerID) 
      VALUE (?,?,?,?)`,
      [newFirstName,newLastName,roleId,managerId],
      )

    //Log the created new employee to the user
    console.log(`
    Created new employee: ${newFirstName} ${newLastName} working as ${roleTitle[0].title} in ${departmentName} department with ${manager[0].first_name} ${manager[0].last_name} as manager
    `) 

    start()
  } catch(err) {
    if(err) throw err 
  }
}

const removeEmployee = async() => {
  try {
    //list employees
    let result = await query(`
      SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name
      FROM departments
      INNER JOIN roles ON roles.departmentID = departments.id
      INNER JOIN employees ON employees.roleID = roles.id`
    )

    //select the employee to remove
    let answer = await inquirer.prompt(menus.selectEmployeeToRemove(result))
    
    //remove employee from table
    await query(`
      DELETE FROM employees
      WHERE employees.id = ?;`,
      [answer.employeeId])

    start()
  } catch(err) {
    if(err) throw err
  }
}

const getManager = async() => {
  try {
    let result = await query(`
      SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name, employees.managerID 
      FROM departments
      INNER JOIN roles ON roles.departmentID = departments.id
      INNER JOIN employees ON employees.roleID = roles.id`
    )
    
    let answer = await inquirer.prompt(menus.choosePerson(result))

    result = await query(`
        SELECT employees.id, employees.first_name, employees.last_name
        FROM employees
        WHERE employees.id = ?`, 
        [answer.personId])
    
    if(!result){console.log(`This employee has no listed manager`)} else {
      console.log(`The manager for this employee is ${result[0].first_name} ${result[0].last_name}`)
    }
    
    start()

  } catch(err) {
    if(err) throw err
  }
}

const getMinions = async() => {
  try{
    //List employees as managers
    let result = await query(`
      SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name
      FROM departments
      INNER JOIN roles ON roles.departmentID = departments.id
      INNER JOIN employees ON employees.roleID = roles.id`
    )

    //select the employee that is to be checked for having Minions
    let answer = await inquirer.prompt(menus.chooseManager(result))

    //query database for minions:
    result = await query(`
      SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name
      FROM departments
      INNER JOIN roles ON roles.departmentID = departments.id
      INNER JOIN employees ON employees.roleID = roles.id
      WHERE employees.managerID = ?`,
      [answer.managerId])

    //table the results and write to table
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

    //return to start menu
    start()

  } catch(err) {
    if(err) throw err
  }
}    


const calcSalaryCosts = async() => {
  try{
    const answer = await inquirer.prompt(menus.chooseResultLimiter)
    if (answer.limiter === "role") {
      salariesByRole()
    } else if (answer.limiter === "department") {
      salariesByDepartment()
    } else {
      salariesTotal()
    }
  } catch (err) {
    throw err;
  }
}

const salariesByRole = async() => {
  try{
    let result = await query(`SELECT roles.id, roles.title FROM roles`)
    let answer = await inquirer.prompt(menus.newEmployeeDetailsRole(result))
    const roleId = answer.roleId
    const roleTitle = await query(`SELECT roles.title FROM roles WHERE roles.id = ?`,[roleId])
    
    //Then calculate the total
    result = await query(`
      SELECT SUM(salary)
      FROM roles
      INNER JOIN employees ON employees.roleID = roles.id
      WHERE employees.roleID = ?;`,
      [roleId])

    const salaryCost = Object.values(result[0])[0]
    console.log(`The total salary cost of ${roleTitle[0].title}s is $${salaryCost}`)
    start()
  } catch(err) {
    if(err) throw err
  }
}

const salariesByDepartment = async() => {
  try{
    let result = await query(`SELECT departments.id, departments.name FROM departments`)
    let answer = await inquirer.prompt(menus.chooseDepartment(result))
    const deptId = answer.departmentId
    const deptName = await query(`SELECT departments.name FROM departments WHERE departments.id = ?`,[deptId])
    
    //Then calculate the total
    result = await query(`
      SELECT SUM(salary)
      FROM roles
      INNER JOIN employees ON employees.roleID = roles.id
      WHERE roles.departmentID = ?`,
      [deptId])

    const salaryCost = Object.values(result[0])[0]
    console.log(`The total salary cost by ${deptName[0].name} Department is $${salaryCost}`)
    start()
  } catch(err) {
    if(err) throw err
  }
}

const salariesTotal = async() => {
  try{
    let result = await query (`
      SELECT SUM(salary)
      FROM roles
      INNER JOIN employees ON employees.roleID = roles.id`)
    
      const salaryCost = Object.values(result[0])[0]
    console.log(`The salary cost for the whole enterprise is $${salaryCost}`)
    start()
  } catch(err) {
    if(err) throw err
  }
}
