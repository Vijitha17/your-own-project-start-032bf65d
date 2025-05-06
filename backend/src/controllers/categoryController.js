const Category = require('../models/Category');

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json({
      status: 'success',
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch categories'
    });
  }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        status: 'error',
        message: 'Category not found'
      });
    }
    res.json({
      status: 'success',
      data: category
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch category'
    });
  }
};

// Create new category
exports.createCategory = async (req, res) => {
  try {
    const { category_id, category_name, description } = req.body;

    // Validate required fields
    if (!category_id || !category_name) {
      return res.status(400).json({
        status: 'error',
        message: 'Category ID and name are required'
      });
    }

    // Check if category already exists
    const existingCategory = await Category.findByName(category_name);
    if (existingCategory) {
      return res.status(400).json({
        status: 'error',
        message: 'Category with this name already exists'
      });
    }

    const result = await Category.create({
      category_id,
      category_name,
      description
    });

    res.status(201).json({
      status: 'success',
      message: 'Category created successfully',
      data: {
        category_id,
        category_name,
        description
      }
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create category'
    });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const { category_name, description } = req.body;
    const categoryId = req.params.id;

    // Check if category exists
    const existingCategory = await Category.findById(categoryId);
    if (!existingCategory) {
      return res.status(404).json({
        status: 'error',
        message: 'Category not found'
      });
    }

    // Check if new name conflicts with existing category
    if (category_name && category_name !== existingCategory.category_name) {
      const nameExists = await Category.findByName(category_name);
      if (nameExists) {
        return res.status(400).json({
          status: 'error',
          message: 'Category with this name already exists'
        });
      }
    }

    await Category.update(categoryId, {
      category_name: category_name || existingCategory.category_name,
      description: description || existingCategory.description
    });

    res.json({
      status: 'success',
      message: 'Category updated successfully'
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update category'
    });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Check if category exists
    const existingCategory = await Category.findById(categoryId);
    if (!existingCategory) {
      return res.status(404).json({
        status: 'error',
        message: 'Category not found'
      });
    }

    await Category.delete(categoryId);

    res.json({
      status: 'success',
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete category'
    });
  }
}; 