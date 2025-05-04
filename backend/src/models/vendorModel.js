const pool = require('../config/database');

class Vendor {
    static async create(vendorData) {
        try {
            const [result] = await pool.query(
                `INSERT INTO Vendors (
                    vendor_id, vendor_name, vendor_type, contact_person, 
                    phone, email, address_line1, address_line2, 
                    city, state, postal_code, country, status, notes
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    vendorData.vendor_id,
                    vendorData.vendor_name,
                    vendorData.vendor_type,
                    vendorData.contact_person,
                    vendorData.phone,
                    vendorData.email,
                    vendorData.address_line1,
                    vendorData.address_line2,
                    vendorData.city,
                    vendorData.state,
                    vendorData.postal_code,
                    vendorData.country || 'USA',
                    vendorData.status || 'Active',
                    vendorData.notes
                ]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    static async findAll() {
        try {
            const [vendors] = await pool.query('SELECT * FROM Vendors ORDER BY created_at DESC');
            return vendors;
        } catch (error) {
            throw error;
        }
    }

    static async findById(vendorId) {
        try {
            const [vendors] = await pool.query('SELECT * FROM Vendors WHERE vendor_id = ?', [vendorId]);
            return vendors[0];
        } catch (error) {
            throw error;
        }
    }

    static async update(vendorId, vendorData) {
        try {
            const [result] = await pool.query(
                `UPDATE Vendors SET 
                    vendor_name = ?,
                    vendor_type = ?,
                    contact_person = ?,
                    phone = ?,
                    email = ?,
                    address_line1 = ?,
                    address_line2 = ?,
                    city = ?,
                    state = ?,
                    postal_code = ?,
                    country = ?,
                    status = ?,
                    notes = ?
                WHERE vendor_id = ?`,
                [
                    vendorData.vendor_name,
                    vendorData.vendor_type,
                    vendorData.contact_person,
                    vendorData.phone,
                    vendorData.email,
                    vendorData.address_line1,
                    vendorData.address_line2,
                    vendorData.city,
                    vendorData.state,
                    vendorData.postal_code,
                    vendorData.country,
                    vendorData.status,
                    vendorData.notes,
                    vendorId
                ]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    static async delete(vendorId) {
        try {
            const [result] = await pool.query('DELETE FROM Vendors WHERE vendor_id = ?', [vendorId]);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    static async search(query) {
        try {
            const [vendors] = await pool.query(
                `SELECT * FROM Vendors 
                WHERE vendor_name LIKE ? 
                OR contact_person LIKE ? 
                OR email LIKE ? 
                OR phone LIKE ?`,
                [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]
            );
            return vendors;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Vendor; 