# Employee Manager System
A console-based program that allows the user to manage a MYSQL database of employees of a business. 

## Author
github.com/spaniel-boone

## Description
This application has been developed as a learning tool to understand the usage of node modules to interact with databases and the operation of SQL queries on a MYSQL database. 

The application incorporates three tables within the database:

* **department**:

  * **id** - INT PRIMARY KEY
  * **name** - VARCHAR(30) to hold department name

* **role**:

  * **id** - INT PRIMARY KEY
  * **title** -  VARCHAR(30) to hold role title
  * **salary** -  DECIMAL to hold role salary
  * **department_id** -  INT to hold reference to department role belongs to

* **employee**:

  * **id** - INT PRIMARY KEY
  * **first_name** - VARCHAR(30) to hold employee first name
  * **last_name** - VARCHAR(30) to hold employee last name
  * **role_id** - INT to hold reference to role employee has
  * **manager_id** - INT to hold reference to another employee that manages the employee being Created. 

Key learnings from this project were:
    - Installation, usage, and use-cases of MYSQL databases, the 'promisification' of callbacks to improve code readability, SQL queries and interactions between different asynchronous modules/actions.  

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)

## Installation
- You must have Node installed on your computer. See here https://nodejs.org/en/download/. 
- Check that you have the latest version of npm installed. In node type this into the console: 'npm install npm@latest -g'
- Ensure you have the following npm modules installed:
    * promisify
    * mysql2
    * dotenv
    * easy-table
    * inquirer
    * util

- Run the program!
    * Navigate to your root directory for the app
    * Type 'node server.js' into the console
    * Answer the prompts!

## Usage
See the link below for a video presenting usage of the Team-profile-generator program
https://drive.google.com/file/d/1KS1Z2e7Qzuz6xBE7sag81vOuQD1f_ylC/view

The actions available to a user include:
* Add a new employee to the database
* View all employees within the database by department, role or all
* Find the manager of an employee
* Find the 'minions' of a manager
* Remove an employee from the database records
* Calculate total salary costs by role, department or for the whole enterprise
* Exit the application

