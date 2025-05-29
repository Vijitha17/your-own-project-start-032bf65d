const pool = require('../config/database');

class PurchaseRequest {
    // Create a new purchase request
    static async create(purchaseRequestData) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            
            // Insert purchase request
            const purchaseRequestQuery = `
                INSERT INTO PurchaseRequests (
                    request_date,
                    notes,
                    requested_by,
                    approve_by,
                    approval_status,
                    total_estimated_cost
                ) VALUES (?, ?, ?, ?, ?, ?)
            `;

            const purchaseRequestValues = [
                purchaseRequestData.request_date,
                purchaseRequestData.notes,
                purchaseRequestData.requested_by,
                purchaseRequestData.approve_by,
                'Pending', // Always start as Pending
                purchaseRequestData.total_estimated_cost || 0
            ];

            const [purchaseRequestResult] = await connection.execute(purchaseRequestQuery, purchaseRequestValues);
            const purchaseRequestId = purchaseRequestResult.insertId;
            
            // Insert items if they exist
            if (purchaseRequestData.items && purchaseRequestData.items.length > 0) {
                const itemsQuery = `
                    INSERT INTO PurchaseRequestItems (
                        purchase_request_id,
                        item_name,
                        category_id,
                        quantity,
                        estimated_unit_cost,
                        specifications,
                        vendor_id,
                        item_status
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `;

                for (const item of purchaseRequestData.items) {
                    const itemValues = [
                        purchaseRequestId,
                        item.item_name,
                        item.category_id,
                        item.quantity,
                        item.estimated_unit_cost,
                        item.specifications,
                        item.vendor_id,
                        'Pending' // Item status also starts as Pending
                    ];
                    await connection.execute(itemsQuery, itemValues);
                }
            }
            
            await connection.commit();
            return await this.findById(purchaseRequestId);
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Get all purchase requests
    static async findAll() {
        const query = `
            SELECT 
                pr.*, 
                CONCAT(u1.first_name, ' ', u1.last_name) as requester_name, 
                CONCAT(u2.first_name, ' ', u2.last_name) as approver_name
            FROM PurchaseRequests pr
            LEFT JOIN users u1 ON pr.requested_by = u1.user_id
            LEFT JOIN users u2 ON pr.approve_by = u2.user_id
            ORDER BY pr.created_at DESC
        `;
        
        const [rows] = await pool.execute(query);
        return rows;
    }

    // Get purchase request by ID with its items
    static async findById(purchaseRequestId) {
        const query = `
            SELECT 
                pr.*,
                CONCAT(u1.first_name, ' ', u1.last_name) as requester_name,
                CONCAT(u2.first_name, ' ', u2.last_name) as approve_by_name
            FROM PurchaseRequests pr
            LEFT JOIN users u1 ON pr.requested_by = u1.user_id
            LEFT JOIN users u2 ON pr.approve_by = u2.user_id
            WHERE pr.purchase_request_id = ?
        `;
        
        const [rows] = await pool.execute(query, [purchaseRequestId]);
        if (rows.length === 0) return null;
        
        const purchaseRequest = rows[0];
        
        // Get items for this purchase request
        const itemsQuery = `
            SELECT 
                pri.*, 
                c.category_name,
                v.vendor_name
            FROM PurchaseRequestItems pri
            LEFT JOIN Categories c ON pri.category_id = c.category_id
            LEFT JOIN vendors v ON pri.vendor_id = v.vendor_id
            WHERE pri.purchase_request_id = ?
            ORDER BY pri.created_at ASC
        `;
        
        const [itemRows] = await pool.execute(itemsQuery, [purchaseRequestId]);
        purchaseRequest.items = itemRows;
        
        return purchaseRequest;
    }

    // Update purchase request
    static async update(purchaseRequestId, purchaseRequestData) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            
            // Update the purchase request
            const updateQuery = `
                UPDATE PurchaseRequests
                SET approve_by = ?,
                    approval_status = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE purchase_request_id = ?
            `;
            
            const [result] = await connection.execute(updateQuery, [
                purchaseRequestData.approve_by,
                purchaseRequestData.approval_status,
                purchaseRequestId
            ]);
            
            // If approved, update all items to approved
            if (purchaseRequestData.approval_status === 'Approved') {
                const updateItemsQuery = `
                    UPDATE PurchaseRequestItems
                    SET item_status = 'Approved'
                    WHERE purchase_request_id = ?
                `;
                await connection.execute(updateItemsQuery, [purchaseRequestId]);
            }
            
            await connection.commit();
            return result.affectedRows > 0;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Delete purchase request
    static async delete(purchaseRequestId) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            
            // Delete the purchase request items first
            const deleteItemsQuery = `
                DELETE FROM PurchaseRequestItems
                WHERE purchase_request_id = ?
            `;
            await connection.execute(deleteItemsQuery, [purchaseRequestId]);
            
            // Delete the purchase request
            const deleteQuery = `
                DELETE FROM PurchaseRequests
                WHERE purchase_request_id = ?
            `;
            const [result] = await connection.execute(deleteQuery, [purchaseRequestId]);
            
            await connection.commit();
            return result.affectedRows > 0;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Get purchase requests by user
    static async findByUser(userId) {
        const query = `
            SELECT 
                pr.*,
                CONCAT(u1.first_name, ' ', u1.last_name) as requester_name,
                CONCAT(u2.first_name, ' ', u2.last_name) as approve_by_name
            FROM PurchaseRequests pr
            LEFT JOIN users u1 ON pr.requested_by = u1.user_id
            LEFT JOIN users u2 ON pr.approve_by = u2.user_id
            WHERE pr.requested_by = ?
            ORDER BY pr.created_at DESC
        `;
        
        const [rows] = await pool.execute(query, [userId]);
        
        // Get items for each purchase request
        for (let pr of rows) {
            const itemsQuery = `
                SELECT 
                    pri.*, 
                    c.category_name,
                    v.vendor_name
                FROM PurchaseRequestItems pri
                LEFT JOIN Categories c ON pri.category_id = c.category_id
                LEFT JOIN vendors v ON pri.vendor_id = v.vendor_id
                WHERE pri.purchase_request_id = ?
                ORDER BY pri.created_at ASC
            `;
            
            const [itemRows] = await pool.execute(itemsQuery, [pr.purchase_request_id]);
            pr.items = itemRows;
        }
        
        return rows;
    }

    // Get purchase requests for approval
    static async findForApproval(approverId) {
        const query = `
            SELECT 
                pr.*,
                CONCAT(u1.first_name, ' ', u1.last_name) as requester_name,
                CONCAT(u2.first_name, ' ', u2.last_name) as approver_name
            FROM PurchaseRequests pr
            LEFT JOIN users u1 ON pr.requested_by = u1.user_id
            LEFT JOIN users u2 ON pr.approve_by = u2.user_id
            WHERE pr.approve_by = ? AND pr.approval_status = 'Pending'
            ORDER BY pr.created_at DESC
        `;
        
        const [rows] = await pool.execute(query, [approverId]);
        
        // Get items for each purchase request
        for (let pr of rows) {
            const itemsQuery = `
                SELECT 
                    pri.*, 
                    c.category_name,
                    v.vendor_name
                FROM PurchaseRequestItems pri
                LEFT JOIN Categories c ON pri.category_id = c.category_id
                LEFT JOIN vendors v ON pri.vendor_id = v.vendor_id
                WHERE pri.purchase_request_id = ?
                ORDER BY pri.created_at ASC
            `;
            
            const [itemRows] = await pool.execute(itemsQuery, [pr.purchase_request_id]);
            pr.items = itemRows;
        }
        
        return rows;
    }

    // Add item to purchase request
    static async addItem(purchaseRequestId, itemData) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            
            // Insert the item
            const itemsQuery = `
                INSERT INTO PurchaseRequestItems (
                    purchase_request_id,
                    item_name,
                    category_id,
                    quantity,
                    estimated_unit_cost,
                    specifications,
                    vendor_id,
                    item_status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            const itemValues = [
                purchaseRequestId,
                itemData.item_name,
                itemData.category_id,
                itemData.quantity,
                itemData.estimated_unit_cost,
                itemData.specifications,
                itemData.vendor_id,
                'Pending' // Item status also starts as Pending
            ];
            
            const [itemResult] = await connection.execute(itemsQuery, itemValues);
            
            // Update the total estimated cost
            const updateQuery = `
                UPDATE PurchaseRequests
                SET total_estimated_cost = (
                    SELECT SUM(estimated_unit_cost * quantity)
                    FROM PurchaseRequestItems
                    WHERE purchase_request_id = ?
                )
                WHERE purchase_request_id = ?
            `;
            
            await connection.execute(updateQuery, [purchaseRequestId, purchaseRequestId]);
            
            await connection.commit();
            return itemResult.insertId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Update item in purchase request
    static async updateItem(itemId, itemData) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            
            // Update the item
            const updateQuery = `
                UPDATE PurchaseRequestItems
                SET item_name = ?,
                    category_id = ?,
                    quantity = ?,
                    estimated_unit_cost = ?,
                    specifications = ?,
                    item_status = ?,
                    vendor_id = ?
                WHERE purchaserequest_item_id = ?
            `;
            
            const [result] = await connection.execute(updateQuery, [
                itemData.item_name,
                itemData.category_id,
                itemData.quantity,
                itemData.estimated_unit_cost,
                itemData.specifications,
                itemData.item_status || 'Pending',
                itemData.vendor_id,
                itemId
            ]);
            
            // Get the purchase request ID
            const [items] = await connection.execute(
                'SELECT purchase_request_id FROM PurchaseRequestItems WHERE purchaserequest_item_id = ?',
                [itemId]
            );
            
            if (items.length > 0) {
                const purchaseRequestId = items[0].purchase_request_id;
                
                // Update the total estimated cost
                const updateTotalQuery = `
                    UPDATE PurchaseRequests
                    SET total_estimated_cost = (
                        SELECT SUM(estimated_unit_cost * quantity)
                        FROM PurchaseRequestItems
                        WHERE purchase_request_id = ?
                    )
                    WHERE purchase_request_id = ?
                `;
                
                await connection.execute(updateTotalQuery, [purchaseRequestId, purchaseRequestId]);
            }
            
            await connection.commit();
            return result.affectedRows > 0;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Delete item from purchase request
    static async deleteItem(itemId) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            
            // Get the purchase request ID
            const [items] = await connection.execute(
                'SELECT purchase_request_id FROM PurchaseRequestItems WHERE purchaserequest_item_id = ?',
                [itemId]
            );
            
            if (items.length === 0) {
                return false;
            }
            
            const purchaseRequestId = items[0].purchase_request_id;
            
            // Delete the item
            const deleteQuery = `
                DELETE FROM PurchaseRequestItems
                WHERE purchaserequest_item_id = ?
            `;
            const [result] = await connection.execute(deleteQuery, [itemId]);
            
            // Update the total estimated cost
            const updateTotalQuery = `
                UPDATE PurchaseRequests
                SET total_estimated_cost = (
                    SELECT COALESCE(SUM(estimated_unit_cost * quantity), 0)
                    FROM PurchaseRequestItems
                    WHERE purchase_request_id = ?
                )
                WHERE purchase_request_id = ?
            `;
            
            await connection.execute(updateTotalQuery, [purchaseRequestId, purchaseRequestId]);
            
            await connection.commit();
            return result.affectedRows > 0;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Get items for a purchase request
    static async getItems(purchaseRequestId) {
        const query = `
            SELECT 
                pri.*, 
                c.category_name,
                v.vendor_name
            FROM PurchaseRequestItems pri
            LEFT JOIN Categories c ON pri.category_id = c.category_id
            LEFT JOIN vendors v ON pri.vendor_id = v.vendor_id
            WHERE pri.purchase_request_id = ?
            ORDER BY pri.created_at ASC
        `;
        
        const [rows] = await pool.execute(query, [purchaseRequestId]);
        return rows;
    }

    // Get item by ID
    static async getItemById(itemId) {
        const query = `
            SELECT 
                pri.*, 
                c.category_name,
                v.vendor_name
            FROM PurchaseRequestItems pri
            LEFT JOIN Categories c ON pri.category_id = c.category_id
            LEFT JOIN vendors v ON pri.vendor_id = v.vendor_id
            WHERE pri.purchaserequest_item_id = ?
        `;
        
        const [rows] = await pool.execute(query, [itemId]);
        return rows[0];
    }

    // Update purchase request status
    static async updateStatus(purchaseRequestId, status, approverId) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            
            // Update purchase request status
            const updateQuery = `
                UPDATE PurchaseRequests
                SET approval_status = ?,
                    approve_by = ?,
                    approved_date = CURRENT_TIMESTAMP,
                    updated_at = CURRENT_TIMESTAMP
                WHERE purchase_request_id = ?
            `;
            
            const [result] = await connection.execute(updateQuery, [
                status,
                approverId,
                purchaseRequestId
            ]);
            
            // If approved, update all items to approved
            if (status === 'Approved') {
                const updateItemsQuery = `
                    UPDATE PurchaseRequestItems
                    SET item_status = 'Approved'
                    WHERE purchase_request_id = ?
                `;
                await connection.execute(updateItemsQuery, [purchaseRequestId]);
            } else if (status === 'Rejected') {
                const updateItemsQuery = `
                    UPDATE PurchaseRequestItems
                    SET item_status = 'Rejected'
                    WHERE purchase_request_id = ?
                `;
                await connection.execute(updateItemsQuery, [purchaseRequestId]);
            }
            
            await connection.commit();
            return result.affectedRows > 0;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Update item status
    static async updateItemStatus(itemId, status) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            
            // Update the item status
            const updateQuery = `
                UPDATE PurchaseRequestItems
                SET item_status = ?
                WHERE purchaserequest_item_id = ?
            `;
            
            const [result] = await connection.execute(updateQuery, [
                status,
                itemId
            ]);
            
            // Get the purchase request ID
            const [items] = await connection.execute(
                'SELECT purchase_request_id FROM PurchaseRequestItems WHERE purchaserequest_item_id = ?',
                [itemId]
            );
            
            if (items.length > 0) {
                const purchaseRequestId = items[0].purchase_request_id;
                
                // Check if all items are approved or rejected
                const [itemStatuses] = await connection.execute(
                    'SELECT item_status FROM PurchaseRequestItems WHERE purchase_request_id = ?',
                    [purchaseRequestId]
                );
                
                let allApproved = true;
                let allRejected = true;
                let hasApproved = false;
                let hasRejected = false;
                
                for (const item of itemStatuses) {
                    if (item.item_status !== 'Approved') {
                        allApproved = false;
                    } else {
                        hasApproved = true;
                    }
                    
                    if (item.item_status !== 'Rejected') {
                        allRejected = false;
                    } else {
                        hasRejected = true;
                    }
                }
                
                // Update the purchase request status
                let newStatus = 'Pending';
                if (allApproved) {
                    newStatus = 'Approved';
                } else if (allRejected) {
                    newStatus = 'Rejected';
                } else if (hasApproved && hasRejected) {
                    newStatus = 'Partially Approved';
                }
                
                await connection.execute(
                    `UPDATE PurchaseRequests
                     SET approval_status = ?,
                         updated_at = CURRENT_TIMESTAMP
                     WHERE purchase_request_id = ?`,
                    [
                        newStatus,
                        purchaseRequestId
                    ]
                );
            }
            
            await connection.commit();
            return result.affectedRows > 0;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
    // Find purchase requests where items count is greater than 0 but items array is empty or count shown as 0
    static async findWithItemsMismatch() {
        const query = `
            SELECT pr.purchase_request_id
            FROM PurchaseRequests pr
            LEFT JOIN (
                SELECT purchase_request_id, COUNT(*) as item_count
                FROM PurchaseRequestItems
                GROUP BY purchase_request_id
            ) pri ON pr.purchase_request_id = pri.purchase_request_id
            WHERE (pri.item_count > 0) AND (
                pr.purchase_request_id NOT IN (
                    SELECT purchase_request_id FROM PurchaseRequestItems
                )
            )
        `;
        const [rows] = await pool.execute(query);
        return rows.map(row => row.purchase_request_id);
    }
}

module.exports = PurchaseRequest;
