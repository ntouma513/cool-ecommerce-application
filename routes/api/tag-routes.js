const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// Get all tags
router.get('/', async (req, res) => {
  try {
    const tags = await Tag.findAll({
      include: [{ model: Product, through: ProductTag }],
    });
    res.status(200).json(tags);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get tag by ID
router.get('/:id', async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, through: ProductTag }],
    });
    if (!tag) {
      return res.status(404).json({ message: 'No tag found with this ID!' });
    }
    res.status(200).json(tag);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new tag
router.post('/', async (req, res) => {
  try {
    const newTag = await Tag.create(req.body);
    res.status(201).json(newTag);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Update tag by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedTag = await Tag.update(req.body, {
      where: { id: req.params.id },
    });
    if (!updatedTag[0]) {
      return res.status(404).json({ message: 'No tag found with this ID!' });
    }
    res.status(200).json({ message: 'Tag updated successfully!' });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete tag by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedTag = await Tag.destroy({ where: { id: req.params.id } });
    if (!deletedTag) {
      return res.status(404).json({ message: 'No tag found with this ID!' });
    }
    res.status(200).json({ message: 'Tag deleted successfully!' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
