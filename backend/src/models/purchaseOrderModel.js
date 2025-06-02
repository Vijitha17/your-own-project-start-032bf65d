const pool = require('../config/database');

class PurchaseOrder {
    // Create a new purchase order
    static async create(purchaseOrderData) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            
            // Validate purchase request exists and is approved
            const [purchaseRequest] = await connection.execute(
                `SELECT pr.* FROM purchaserequests pr 
                WHERE pr.purchase_request_id = ?`,
                [purchaseOrderData.purchase_request_id]
            );

            if (purchaseRequest.length === 0) {
                throw new Error('Purchase request not found');
            }

            if (purchaseRequest[0].approval_status !== 'Approved') {
                throw new Error('Purchase request must be approved before creating a purchase order');
            }
            
            // Generate purchase order ID (PO-YYYY-XXXX format)
            const [lastOrder] = await connection.execute(
                'SELECT purchase_order_id FROM purchase_orders ORDER BY created_at DESC LIMIT 1'
            );
            
            let newOrderNumber = 1;
            if (lastOrder.length > 0) {
                const lastNumber = parseInt(lastOrder[0].purchase_order_id.split('-')[2]);
                newOrderNumber = lastNumber + 1;
            }
            
            const purchaseOrderId = `PO-${new Date().getFullYear()}-${String(newOrderNumber).padStart(4, '0')}`;
            
            // Get purchase request items to create purchase order items
            const [requestItems] = await connection.execute(
                `SELECT * FROM purchaserequestitems WHERE purchase_request_id = ?`,
                [purchaseOrderData.purchase_request_id]
            );

            // Calculate total amount from request items
            const totalAmount = requestItems.reduce((sum, item) => {
                return sum + (Number(item.quantity) * Number(item.estimated_unit_cost));
            }, 0);

            // Ensure paid amount is a valid number and handle payment status
            const paidAmount = Number(purchaseOrderData.paid_amount) || 0;
            let paymentStatus = 'Unpaid';
            if (paidAmount >= totalAmount) {
                paymentStatus = 'Paid';
            } else if (paidAmount > 0) {
                paymentStatus = 'Partially Paid';
            }

            console.log('Creating purchase order with values:', {
                totalAmount,
                paidAmount,
                paymentStatus,
                purchaseOrderData
            });

            // Insert purchase order with default values for optional fields
            const purchaseOrderQuery = `
                INSERT INTO purchase_orders (
                    purchase_order_id,
                    purchase_request_id,
                    order_date,
                    vendor_id,
                    ordered_by,
                    approved_by,
                    total_amount,
                    paid_amount,
                    payment_status,
                    payment_id,
                    order_status,
                    notes
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const purchaseOrderValues = [
                purchaseOrderId,
                purchaseOrderData.purchase_request_id,
                purchaseOrderData.order_date || new Date().toISOString().slice(0, 19).replace('T', ' '),
                purchaseOrderData.vendor_id,
                purchaseOrderData.ordered_by,
                purchaseOrderData.approved_by || null,
                totalAmount,
                paidAmount,
                paymentStatus,
                purchaseOrderData.payment_id || null,
                'Placed', // Default order status
                purchaseOrderData.notes || null
            ];

            console.log('Executing purchase order insert with values:', purchaseOrderValues);
            await connection.execute(purchaseOrderQuery, purchaseOrderValues);
            
            // Insert purchase order items
            if (requestItems.length > 0) {
                const itemsQuery = `
                    INSERT INTO purchase_order_items (
                        purchase_order_id,
                        purchaserequest_item_id,
                        item_name,
                        category_id,
                        quantity,
                        unit_price
                    ) VALUES (?, ?, ?, ?, ?, ?)
                `;

                for (const item of requestItems) {
                    const itemValues = [
                        purchaseOrderId,
                        item.purchaserequest_item_id,
                        item.item_name,
                        item.category_id,
                        item.quantity,
                        item.estimated_unit_cost // Use the estimated cost from request as initial unit price
                    ];
                    await connection.execute(itemsQuery, itemValues);
                }
            }
            
            await connection.commit();
            return await this.findById(purchaseOrderId);
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Find purchase order by ID with related data
    static async findById(purchaseOrderId) {
        try {
            const [order] = await pool.execute(
                `SELECT 
                    po.*,
                    pr.request_date as purchase_request_date,
                    pr.approval_status as purchase_request_status,
                    v.vendor_name,
                    v.vendor_type,
                    v.contact_person as vendor_contact,
                    v.phone as vendor_phone,
                    v.email as vendor_email,
                    u1.first_name as ordered_by_first_name,
                    u1.last_name as ordered_by_last_name,
                    u2.first_name as approved_by_first_name,
                    u2.last_name as approved_by_last_name
                FROM purchase_orders po
                LEFT JOIN purchaserequests pr ON po.purchase_request_id = pr.purchase_request_id
                LEFT JOIN vendors v ON po.vendor_id = v.vendor_id
                LEFT JOIN users u1 ON po.ordered_by = u1.user_id
                LEFT JOIN users u2 ON po.approved_by = u2.user_id
                WHERE po.purchase_order_id = ?`,
                [purchaseOrderId]
            );

            if (order.length === 0) {
                return null;
            }

            // Get order items with category information
            const [items] = await pool.execute(
                `SELECT 
                    poi.*,
                    c.category_name,
                    pri.estimated_unit_cost as request_estimated_cost,
                    pri.quantity as request_quantity
                FROM purchase_order_items poi
                LEFT JOIN categories c ON poi.category_id = c.category_id
                LEFT JOIN purchaserequestitems pri ON poi.purchaserequest_item_id = pri.purchaserequest_item_id
                WHERE poi.purchase_order_id = ?`,
                [purchaseOrderId]
            );

            return {
                ...order[0],
                items
            };
        } catch (error) {
            throw error;
        }
    }

    // Get all purchase orders with related data
    static async findAll() {
        try {
            const [orders] = await pool.execute(
                `SELECT 
                    po.*,
                    pr.request_date as purchase_request_date,
                    pr.approval_status as purchase_request_status,
                    v.vendor_name,
                    v.vendor_type,
                    u1.first_name as ordered_by_first_name,
                    u1.last_name as ordered_by_last_name,
                    u2.first_name as approved_by_first_name,
                    u2.last_name as approved_by_last_name,
                    (SELECT COUNT(*) FROM purchase_order_items WHERE purchase_order_id = po.purchase_order_id) as total_items
                FROM purchase_orders po
                LEFT JOIN purchaserequests pr ON po.purchase_request_id = pr.purchase_request_id
                LEFT JOIN vendors v ON po.vendor_id = v.vendor_id
                LEFT JOIN users u1 ON po.ordered_by = u1.user_id
                LEFT JOIN users u2 ON po.approved_by = u2.user_id
                ORDER BY po.created_at DESC`
            );

            // For each order, get its items
            for (let order of orders) {
                const [items] = await pool.execute(
                    `SELECT 
                        poi.*,
                        c.category_name
                    FROM purchase_order_items poi
                    LEFT JOIN categories c ON poi.category_id = c.category_id
                    WHERE poi.purchase_order_id = ?`,
                    [order.purchase_order_id]
                );
                order.items = items;
            }

            return orders;
        } catch (error) {
            throw error;
        }
    }

    // Update purchase order
    static async update(purchaseOrderId, updateData) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // Update purchase order
            const updateFields = Object.keys(updateData)
                .filter(key => key !== 'items')
                .map(key => `${key} = ?`)
                .join(', ');

            if (updateFields.length > 0) {
                const updateQuery = `
                    UPDATE purchase_orders 
                    SET ${updateFields}
                    WHERE purchase_order_id = ?
                `;

                const values = [
                    ...Object.values(updateData).filter((_, index) => Object.keys(updateData)[index] !== 'items'),
                    purchaseOrderId
                ];

                await connection.execute(updateQuery, values);
            }

            // Update items if provided
            if (updateData.items) {
                for (const item of updateData.items) {
                    if (item.purchaseorder_item_id) {
                        // Update existing item
                        const itemUpdateQuery = `
                            UPDATE purchase_order_items 
                            SET quantity = ?, unit_price = ?, specifications = ?, item_status = ?
                            WHERE purchaseorder_item_id = ?
                        `;
                        await connection.execute(itemUpdateQuery, [
                            item.quantity,
                            item.unit_price,
                            item.specifications,
                            item.item_status,
                            item.purchaseorder_item_id
                        ]);
                    } else {
                        // Insert new item
                        const itemInsertQuery = `
                            INSERT INTO purchase_order_items (
                                purchase_order_id,
                                purchaserequest_item_id,
                                item_name,
                                category_id,
                                quantity,
                                unit_price,
                                specifications,
                                item_status
                            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                        `;
                        await connection.execute(itemInsertQuery, [
                            purchaseOrderId,
                            item.purchaserequest_item_id,
                            item.item_name,
                            item.category_id,
                            item.quantity,
                            item.unit_price,
                            item.specifications,
                            item.item_status || 'Ordered'
                        ]);
                    }
                }
            }

            await connection.commit();
            return await this.findById(purchaseOrderId);
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Delete purchase order
    static async delete(purchaseOrderId) {
        try {
            const [result] = await pool.execute(
                'DELETE FROM purchase_orders WHERE purchase_order_id = ?',
                [purchaseOrderId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Get approved purchase requests that can be used to create purchase orders
    static async getApprovedPurchaseRequests() {
        try {
            const [requests] = await pool.execute(
                `SELECT 
                    pr.*,
                    u1.first_name as requested_by_first_name,
                    u1.last_name as requested_by_last_name,
                    u2.first_name as approved_by_first_name,
                    u2.last_name as approved_by_last_name,
                    (SELECT COUNT(*) FROM purchaserequestitems WHERE purchase_request_id = pr.purchase_request_id) as total_items
                FROM purchaserequests pr
                LEFT JOIN users u1 ON pr.requested_by = u1.user_id
                LEFT JOIN users u2 ON pr.approve_by = u2.user_id
                WHERE pr.approval_status = 'Approved'
                AND NOT EXISTS (
                    SELECT 1 FROM purchase_orders po 
                    WHERE po.purchase_request_id = pr.purchase_request_id
                )
                ORDER BY pr.request_date DESC`
            );

            // For each request, get its items
            for (let request of requests) {
                const [items] = await pool.execute(
                    `SELECT 
                        pri.*,
                        c.category_name,
                        v.vendor_name,
                        v.vendor_type
                    FROM purchaserequestitems pri
                    LEFT JOIN categories c ON pri.category_id = c.category_id
                    LEFT JOIN vendors v ON pri.vendor_id = v.vendor_id
                    WHERE pri.purchase_request_id = ?`,
                    [request.purchase_request_id]
                );
                request.items = items;
            }

            return requests;
        } catch (error) {
            throw error;
        }
    }

    // Get available vendors
    static async getAvailableVendors() {
        try {
            const [vendors] = await pool.execute(
                `SELECT 
                    vendor_id,
                    vendor_name,
                    vendor_type,
                    contact_person,
                    phone,
                    email,
                    status
                FROM vendors 
                WHERE status = 'Active'
                ORDER BY vendor_name`
            );
            return vendors;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = PurchaseOrder; 