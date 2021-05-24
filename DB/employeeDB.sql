DROP DATABASE IF EXISTS employeeDB;

CREATE DATABASE employeeDB;
USE employeeDB;

CREATE TABLE departments(
    id INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(30),
    PRIMARY KEY (id)
);

CREATE TABLE roles(
    id INT AUTO_INCREMENT NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10) NOT NULL,
    PRIMARY KEY (id),

    departmentID INT NOT NULL,
    FOREIGN KEY (departmentID) REFERENCES departments(id)
);

CREATE TABLE employees(
    id INT AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (id),

    roleID INT NOT NULL,
    FOREIGN KEY (roleID) REFERENCES roles(id),

    managerID INT,
    FOREIGN KEY (managerID) REFERENCES employees(id)
);


/* Seed the database */
INSERT INTO departments (name)
VALUES ("Executive"),("Procurement"),("Supply Chain Logistics"),("Finance"),("Retail and Wholesale");

INSERT INTO roles (title, salary, departmentID)
VALUES ("Director", 100000, 1),

("Country Manager",35000,2),
("Buying Agent",10000,2),
("Washing Station Manager",15000,2),
("Picker Team Manager",8000,2),
("Washing Station Attendant","5000",2),
("Certified Picker",5000,2),

("Supply Chains Manager",80000,3),
("Operations Officer",60000,3),

("Finance Manager",70000,4),
("Accunts Officer",50000,4),

("Marketing Manager",50000,5),
("Sales Officer",30000,5);

INSERT INTO employees (first_name,last_name,roleID,managerID)
VALUES ("Daniel","Gregg",1,NULL);

DROP DATABASE IF EXISTS employeeDB;

CREATE DATABASE employeeDB;
USE employeeDB;

CREATE TABLE departments(
    id INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(30),
    PRIMARY KEY (id)
);

CREATE TABLE roles(
    id INT AUTO_INCREMENT NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10) NOT NULL,
    PRIMARY KEY (id),

    departmentID INT NOT NULL,
    FOREIGN KEY (departmentID) REFERENCES departments(id)
);

CREATE TABLE employees(
    id INT AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (id),

    roleID INT NOT NULL,
    FOREIGN KEY (roleID) REFERENCES roles(id),

    managerID INT,
    FOREIGN KEY (managerID) REFERENCES employees(id)
);


/* Seed the database */
INSERT INTO departments (name)
VALUES ("Executive"),("Procurement"),("Supply Chain Logistics"),("Finance"),("Retail and Wholesale");

INSERT INTO roles (title, salary, departmentID)
VALUES ("Director", 100000, 1),

("Country Manager",35000,2),
("Buying Agent",10000,2),
("Washing Station Manager",15000,2),
("Picker Team Manager",8000,2),
("Washing Station Attendant","5000",2),
("Certified Picker",5000,2),

("Supply Chains Manager",80000,3),
("Operations Officer",60000,3),

("Finance Manager",70000,4),
("Accunts Officer",50000,4),

("Marketing Manager",50000,5),
("Sales Officer",30000,5);

INSERT INTO employees (first_name,last_name,roleID,managerID)
VALUES ("Daniel","Gregg",1,NULL),

("Njoke", "Julius",2,1),
("Harriett","Dismas",4,2),
("Bobby","Wine",3,2),

("Cansin","Smith",8,1),

("Eddy","Marley",10,1),
("Lucy","Gregg",11,6),

("Adam","Collett",12,1),
("Campbell","Herbert",13,8);
