-- Create database
CREATE DATABASE IF NOT EXISTS imsfinaldb;
USE imsfinaldb;

-- Create Colleges table with VARCHAR ID
CREATE TABLE colleges (
    college_id VARCHAR(50) PRIMARY KEY,
    college_name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Departments table with VARCHAR ID
CREATE TABLE departments (
    department_id VARCHAR(50) PRIMARY KEY,
    department_name VARCHAR(50) NOT NULL,
    college_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (department_name, college_id),
    FOREIGN KEY (college_id) REFERENCES colleges(college_id) ON DELETE CASCADE
);

-- Create Locations table with VARCHAR ID
CREATE TABLE locations (
    location_id VARCHAR(50) PRIMARY KEY,
    location VARCHAR(50) NOT NULL,
    location_name VARCHAR(50) NOT NULL,
    college_id VARCHAR(50) NOT NULL,
    department_id VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (location_name, college_id, department_id),
    FOREIGN KEY (college_id) REFERENCES colleges(college_id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL
);

-- Create Users table with VARCHAR ID
CREATE TABLE users (
    user_id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('Management', 'Management_Admin', 'Principal', 'HOD', 'Department_Incharge') NOT NULL,
    college_id VARCHAR(50),
    department_id VARCHAR(50),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (college_id) REFERENCES colleges(college_id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL
);