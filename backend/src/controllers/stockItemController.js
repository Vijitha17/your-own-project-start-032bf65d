const StockItem = require('../models/stockItemModel');

exports.bulkCreateStockItems = async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No stock items provided' });
    }

    // Validate required fields for each item
    for (const item of items) {
      if (!item.stock_item_id || !item.purchase_order_id || !item.item_name || !item.category_id) {
        return res.status(400).json({ success: false, message: 'Missing required fields in one or more stock items' });
      }
    }

    // Bulk create stock items
    const createdItems = await StockItem.bulkCreate(items);

    return res.status(201).json({ success: true, data: createdItems });
  } catch (error) {
    console.error('Error creating stock items:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
