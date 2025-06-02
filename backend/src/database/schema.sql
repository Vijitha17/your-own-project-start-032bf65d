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

-- Create Vendors table with VARCHAR ID
CREATE TABLE vendors (
    vendor_id VARCHAR(50) PRIMARY KEY,
    vendor_name VARCHAR(100) NOT NULL UNIQUE,
    vendor_type ENUM('Service', 'Product', 'Both') NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    status ENUM('Active', 'Inactive', 'Blacklisted') DEFAULT 'Active',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE Categories (
    category_id VARCHAR(10) PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE locations (
    location_id VARCHAR(50) PRIMARY KEY,
    location_name VARCHAR(100) NOT NULL,
    college_id VARCHAR(50) NOT NULL,
    department_id VARCHAR(50),
    location_type ENUM('Classroom', 'Staffroom', 'Hod Room', 'Lab', 'Library', 'Office', 'Exam Cell') NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (college_id) REFERENCES colleges(college_id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL,
    UNIQUE (location_name, college_id, department_id)
);


-- PurchaseRequests table
CREATE TABLE PurchaseRequests (
    purchase_request_id INT AUTO_INCREMENT PRIMARY KEY,
    requested_by VARCHAR(50) NOT NULL,
    approve_by VARCHAR(50),
    request_date DATETIME NOT NULL,
    approval_status ENUM('Pending', 'Approved', 'Rejected', 'Partially Approved') DEFAULT 'Pending',
    approved_date DATETIME,
    total_estimated_cost DECIMAL(12,2) DEFAULT 0.00,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (requested_by) REFERENCES users(user_id),
    FOREIGN KEY (approve_by) REFERENCES users(user_id)
);

-- PurchaseRequestItems table
CREATE TABLE PurchaseRequestItems (
    purchaserequest_item_id INT AUTO_INCREMENT PRIMARY KEY,
    purchase_request_id INT NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    category_id VARCHAR(10) NOT NULL,
    quantity INT NOT NULL,
    estimated_unit_cost DECIMAL(10,2) NOT NULL,
    estimated_total_cost DECIMAL(10,2) GENERATED ALWAYS AS (quantity * estimated_unit_cost) STORED,
    specifications TEXT,
    item_status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    vendor_id VARCHAR(50),
    FOREIGN KEY (purchase_request_id) REFERENCES PurchaseRequests(purchase_request_id),
    FOREIGN KEY (category_id) REFERENCES Categories(category_id),
    FOREIGN KEY (vendor_id) REFERENCES vendors(vendor_id),
    INDEX (purchase_request_id)
);


-- PurchaseOrders table
CREATE TABLE PurchaseOrders (
    purchase_order_id VARCHAR(20) PRIMARY KEY,
    purchase_request_id INT NOT NULL,
    order_date DATETIME NOT NULL,
    vendor_id VARCHAR(50) NOT NULL,
    ordered_by VARCHAR(50) NOT NULL,
    approved_by VARCHAR(50),
    total_amount DECIMAL(12,2) NOT NULL,
    paid_amount DECIMAL(12,2) DEFAULT 0.00,
    balance_amount DECIMAL(12,2) GENERATED ALWAYS AS (ROUND(grand_total - paid_amount, 2)) STORED,
    tax_amount DECIMAL(12,2) DEFAULT 0.00,
    shipping_amount DECIMAL(12,2) DEFAULT 0.00,
    discount_amount DECIMAL(12,2) DEFAULT 0.00,
    grand_total DECIMAL(12,2) GENERATED ALWAYS AS (ROUND(total_amount + tax_amount + shipping_amount - discount_amount, 2)) STORED,
    payment_status ENUM('Unpaid', 'Partially Paid', 'Paid', 'Refunded') DEFAULT 'Unpaid',
    payment_reference VARCHAR(100) COMMENT 'Bill number/Transaction ID/Payment reference',
    bill_copy_path VARCHAR(255) COMMENT 'Path to uploaded bill copy/image',
    order_status ENUM('Placed', 'Delivered', 'Cancelled', 'Received', 'Returned') DEFAULT 'Placed',
    return_reason TEXT,
    return_date DATE,
    expected_receive_after_return DATE,
    expected_delivery_date DATE,
    actual_delivery_date DATE,
    payment_terms VARCHAR(100),
    payment_date DATE,
    shipping_method VARCHAR(100),
    tracking_number VARCHAR(100),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (purchase_request_id) REFERENCES PurchaseRequests(purchase_request_id),
    FOREIGN KEY (vendor_id) REFERENCES vendors(vendor_id),
    FOREIGN KEY (ordered_by) REFERENCES users(user_id),
    FOREIGN KEY (approved_by) REFERENCES users(user_id)
);

-- PurchaseOrderItems table
CREATE TABLE PurchaseOrderItems (
    purchaseorder_item_id INT AUTO_INCREMENT PRIMARY KEY,
    purchase_order_id VARCHAR(20) NOT NULL,
    purchaserequest_item_id INT NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    category_id VARCHAR(10) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(12,2) NOT NULL,
    total_price DECIMAL(12,2) GENERATED ALWAYS AS (ROUND(quantity * unit_price, 2)) STORED,
    received_quantity INT DEFAULT 0,
    returned_quantity INT DEFAULT 0,
    item_status ENUM('Ordered', 'Received', 'Cancelled', 'Returned') DEFAULT 'Ordered',
    item_return_reason TEXT,
    specifications TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (purchase_order_id) REFERENCES PurchaseOrders(purchase_order_id),
    FOREIGN KEY (purchaserequest_item_id) REFERENCES PurchaseRequestItems(purchaserequest_item_id),
    FOREIGN KEY (category_id) REFERENCES Categories(category_id),
    INDEX (purchase_order_id)
);

CREATE TABLE PurchaseOrderItems (
    purchaseorder_item_id INT AUTO_INCREMENT PRIMARY KEY,
    purchase_order_id VARCHAR(20) NOT NULL,
    purchaserequest_item_id INT NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    category_id VARCHAR(10) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(12,2) NOT NULL,
    total_price DECIMAL(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    received_quantity INT DEFAULT 0,
    returned_quantity INT DEFAULT 0,
    remaining_quantity INT GENERATED ALWAYS AS (quantity - received_quantity + returned_quantity) STORED,
    item_status ENUM('Ordered', 'Received', 'Cancelled', 'Returned') DEFAULT 'Ordered',
    item_return_reason TEXT,
    specifications TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (purchase_order_id) REFERENCES PurchaseOrders(purchase_order_id) ON DELETE CASCADE,
    FOREIGN KEY (purchaserequest_item_id) REFERENCES PurchaseRequestItems(purchaserequest_item_id),
    FOREIGN KEY (category_id) REFERENCES Categories(category_id),
    INDEX (purchase_order_id)
);