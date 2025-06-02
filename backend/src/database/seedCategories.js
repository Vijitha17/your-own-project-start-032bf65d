const pool = require('../config/database');

const categories = [
  { category_id: 'CAT001', category_name: 'Equipment', description: 'Electronic and technical equipment' },
  { category_id: 'CAT002', category_name: 'Furniture', description: 'Office and classroom furniture' },
  { category_id: 'CAT003', category_name: 'Supplies', description: 'General office and classroom supplies' },
  { category_id: 'CAT004', category_name: 'Electronics', description: 'Electronic devices and accessories' },
  { category_id: 'CAT005', category_name: 'Software', description: 'Software licenses and subscriptions' },
  { category_id: 'CAT006', category_name: 'Stationery', description: 'Paper, pens, and other stationery items' },
  { category_id: 'CAT007', category_name: 'Lab Equipment', description: 'Laboratory equipment and supplies' },
  { category_id: 'CAT008', category_name: 'Sports', description: 'Sports equipment and supplies' },
  { category_id: 'CAT009', category_name: 'Maintenance', description: 'Maintenance and repair items' },
  { category_id: 'CAT010', category_name: 'Safety', description: 'Safety equipment and supplies' }
];

async function seedCategories() {
  try {
    // First, clear existing categories
    await pool.query('DELETE FROM Categories');
    
    // Insert new categories
    for (const category of categories) {
      await pool.query(
        'INSERT INTO Categories (category_id, category_name, description) VALUES (?, ?, ?)',
        [category.category_id, category.category_name, category.description]
      );
    }
    
    console.log('Categories seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
}

seedCategories(); 