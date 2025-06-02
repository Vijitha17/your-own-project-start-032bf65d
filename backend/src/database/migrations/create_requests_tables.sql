-- Create requests table
CREATE TABLE requests (
    request_id VARCHAR(36) PRIMARY KEY,
    approver1_id VARCHAR(36) NOT NULL,
    approver2_id VARCHAR(36) NOT NULL,
    approver3_id VARCHAR(36) NOT NULL,
    requested_by VARCHAR(36) NOT NULL,
    department_id VARCHAR(36) NOT NULL,
    college_id VARCHAR(36) NOT NULL,
    approver1_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    approver2_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    approver3_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    final_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    approver1_comment TEXT,
    approver2_comment TEXT,
    approver3_comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (approver1_id) REFERENCES users(user_id),
    FOREIGN KEY (approver2_id) REFERENCES users(user_id),
    FOREIGN KEY (approver3_id) REFERENCES users(user_id),
    FOREIGN KEY (requested_by) REFERENCES users(user_id),
    FOREIGN KEY (department_id) REFERENCES departments(department_id),
    FOREIGN KEY (college_id) REFERENCES colleges(college_id)
);

-- Create request_items table
CREATE TABLE request_items (
    request_item_id VARCHAR(36) PRIMARY KEY,
    request_id VARCHAR(36) NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES requests(request_id) ON DELETE CASCADE
);

-- Add indexes for better query performance
CREATE INDEX idx_requests_approver1 ON requests(approver1_id);
CREATE INDEX idx_requests_approver2 ON requests(approver2_id);
CREATE INDEX idx_requests_approver3 ON requests(approver3_id);
CREATE INDEX idx_requests_requested_by ON requests(requested_by);
CREATE INDEX idx_requests_department ON requests(department_id);
CREATE INDEX idx_requests_college ON requests(college_id);
CREATE INDEX idx_requests_final_status ON requests(final_status);
CREATE INDEX idx_request_items_request ON request_items(request_id);
CREATE INDEX idx_request_items_status ON request_items(status); 