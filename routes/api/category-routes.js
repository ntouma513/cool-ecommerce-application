const router = require('express').Router();
const { Category, Product } = require('../../models'); // Import Category and Product models

// The `/api/categories` endpoint

// GET all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [Product], // Eager load associated products
    });
    res.status(200).json(categories);
  } catch (err) {
    console.error('Error:', err); // Log error to the console
    res.status(500).json({ error: 'An internal server error occurred' });
  }
});

// GET a single category by its `id`
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [Product], // Eager load associated products
    });
    if (!category) {
      return res.status(404).json({ message: 'No category found with this ID!' });
    }
    res.status(200).json(category);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'An internal server error occurred' });
  }
});

// POST (create) a new category
router.post('/', async (req, res) => {
  try {
    const newCategory = await Category.create(req.body); // `req.body` should include `category_name`
    res.status(201).json(newCategory);
  } catch (err) {
    console.error('Error:', err);
    res.status(400).json({ error: 'Failed to create new category. Ensure the request body is correct.' });
  }
});

// PUT (update) a category by its `id`
router.put('/:id', async (req, res) => {
  try {
    const updatedCategory = await Category.update(req.body, {
      where: { id: req.params.id },
    });
    if (!updatedCategory[0]) {
      return res.status(404).json({ message: 'No category found with this ID!' });
    }
    res.status(200).json({ message: 'Category updated successfully!' });
  } catch (err) {
    console.error('Error:', err);
    res.status(400).json({ error: 'Failed to update category. Ensure the request body is correct.' });
  }
});

// DELETE a category by its `id`
router.delete('/:id', async (req, res) => {
  try {
    const deletedCategory = await Category.destroy({
      where: { id: req.params.id },
    });
    if (!deletedCategory) {
      return res.status(404).json({ message: 'No category found with this ID!' });
    }
    res.status(200).json({ message: 'Category deleted successfully!' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to delete category.' });
  }
});

module.exports = router;
