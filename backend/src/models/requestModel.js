const pool = require('../config/database');

class Request {
    // Create a new request
    static async create(requestData) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            
            // Get user's department and college IDs
            const [users] = await connection.query(
                'SELECT department_id, college_id FROM users WHERE user_id = ?',
                [requestData.requested_by]
            );

            if (!users.length) {
                throw new Error('User not found');
            }

            const { department_id, college_id } = users[0];

            // Generate UUID for request_id
            const [uuidResult] = await connection.query('SELECT UUID() as uuid');
            const requestId = uuidResult[0].uuid;

            // Insert into requests table
            const [requestResult] = await connection.query(
                `INSERT INTO requests (
                    request_id,
                    approver1_id,
                    approver2_id,
                    approver3_id,
                    requested_by,
                    department_id,
                    college_id,
                    approver1_status,
                    approver2_status,
                    approver3_status,
                    final_status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', 'pending', 'pending', 'pending')`,
                [
                    requestId,
                    requestData.approver1_id,
                    requestData.approver2_id,
                    requestData.approver3_id,
                    requestData.requested_by,
                    department_id,
                    college_id
                ]
            );

            // Insert request items
            if (requestData.items && requestData.items.length > 0) {
                const itemValues = requestData.items.map(item => [
                    requestId,
                    item.item_name,
                    item.quantity,
                    item.specifications || null
                ]);

                await connection.query(
                    `INSERT INTO request_items (
                        request_id,
                        item_name,
                        quantity,
                        specifications
                    ) VALUES ?`,
                    [itemValues]
                );
            }

            await connection.commit();

            // Fetch the created request with items
            const [createdRequest] = await connection.query(
                `SELECT r.*, 
                    d.department_name,
                    u.full_name as requester_name,
                    GROUP_CONCAT(
                        JSON_OBJECT(
                            'item_id', ri.request_item_id,
                            'item_name', ri.item_name,
                            'quantity', ri.quantity,
                            'specifications', ri.specifications,
                            'status', ri.status
                        )
                    ) as items
                FROM requests r
                LEFT JOIN departments d ON r.department_id = d.department_id
                LEFT JOIN users u ON r.requested_by = u.user_id
                LEFT JOIN request_items ri ON r.request_id = ri.request_id
                WHERE r.request_id = ?
                GROUP BY r.request_id`,
                [requestId]
            );

            if (createdRequest[0].items) {
                createdRequest[0].items = JSON.parse(`[${createdRequest[0].items}]`);
            } else {
                createdRequest[0].items = [];
            }

            return createdRequest[0];
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Get all requests
    static async findAll() {
        try {
            const [requests] = await pool.query(`
                SELECT 
                    r.*,
                    d.department_name,
                    CONCAT(u.first_name, ' ', u.last_name) as requester_name,
                    CONCAT(hod.first_name, ' ', hod.last_name) as hod_name,
                    CONCAT(principal.first_name, ' ', principal.last_name) as principal_name,
                    CONCAT(admin.first_name, ' ', admin.last_name) as admin_name,
                    CONCAT('[',
                        GROUP_CONCAT(
                            IF(ri.request_item_id IS NOT NULL,
                                JSON_OBJECT(
                                    'request_item_id', ri.request_item_id,
                                    'item_name', ri.item_name,
                                    'quantity', ri.quantity,
                                    'status', ri.status
                                ),
                                NULL
                            )
                        ),
                    ']') as items
                FROM requests r
                LEFT JOIN departments d ON r.department_id = d.department_id
                LEFT JOIN users u ON r.requested_by = u.user_id
                LEFT JOIN users hod ON r.approver1_id = hod.user_id
                LEFT JOIN users principal ON r.approver2_id = principal.user_id
                LEFT JOIN users admin ON r.approver3_id = admin.user_id
                LEFT JOIN request_items ri ON r.request_id = ri.request_id
                GROUP BY r.request_id
                ORDER BY r.request_date DESC
            `);

            return requests.map(request => ({
                ...request,
                items: request.items ? JSON.parse(request.items.replace(/null,?/g, '').replace(/,\]/g, ']')) : []
            }));
        } catch (error) {
            console.error('Error in findAll:', error);
            throw error;
        }
    }

    // Get request by ID
    static async findById(id) {
        const [requests] = await pool.query(
            `SELECT r.*, 
                d.department_name,
                u.full_name as requester_name,
                GROUP_CONCAT(
                    JSON_OBJECT(
                        'item_id', ri.request_item_id,
                        'item_name', ri.item_name,
                        'quantity', ri.quantity,
                        'specifications', ri.specifications,
                        'status', ri.status
                    )
                ) as items
            FROM requests r
            LEFT JOIN departments d ON r.department_id = d.department_id
            LEFT JOIN users u ON r.requested_by = u.user_id
            LEFT JOIN request_items ri ON r.request_id = ri.request_id
            WHERE r.request_id = ?
            GROUP BY r.request_id`,
            [id]
        );

        if (requests.length === 0) {
            return null;
        }

        const request = requests[0];
        if (request.items) {
            request.items = JSON.parse(`[${request.items}]`);
        } else {
            request.items = [];
        }

        return request;
    }
}

module.exports = Request; 