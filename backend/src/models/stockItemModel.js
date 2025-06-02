const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StockItem = sequelize.define('StockItem', {
  stock_item_id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  purchase_order_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  item_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  brand: {
    type: DataTypes.STRING,
  },
  details: {
    type: DataTypes.TEXT,
  },
  category_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  base_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  sub_quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'In Stock',
  },
  allocated_to_type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  allocated_to_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  location_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'stock_items',
  timestamps: true,
});

module.exports = StockItem;
