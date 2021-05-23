DROP DATABASE IF EXISTS employeeDB;

CREATE DATABASE employeeDB;
USE employeeDB;

CREATE TABLE departments(
    id INT NOT NULL,
    name VARCHAR(30),
    PRIMARY KEY (id)
);

CREATE TABLE roles(
    id INT NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10) NOT NULL,
    PRIMARY KEY (id),

    departmentID INT NOT NULL,
    FOREIGN KEY (departmentID) REFERENCES departments(id)
);

CREATE TABLE employees(
    id INT NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (id),

    roleID INT NOT NULL,
    FOREIGN KEY (roleID) REFERENCES roles(id),

    managerID INT NOT NULL,
    FOREIGN KEY (managerID) REFERENCES employees(id)
);



