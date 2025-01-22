const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [Category, { model: Tag, through: ProductTag }],
    });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [Category, { model: Tag, through: ProductTag }],
    });
    if (!product) {
      return res.status(404).json({ message: 'No product found with this ID!' });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new product
router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    if (req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });
      await ProductTag.bulkCreate(productTagIdArr);
    }
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.update(req.body, {
      where: { id: req.params.id },
    });

    if (req.body.tagIds && req.body.tagIds.length) {
      const existingTags = await ProductTag.findAll({ where: { product_id: req.params.id } });
      const productTagIds = existingTags.map(({ tag_id }) => tag_id);

      const newTags = req.body.tagIds.filter((tag_id) => !productTagIds.includes(tag_id)).map((tag_id) => ({
        product_id: req.params.id,
        tag_id,
      }));

      const tagsToRemove = existingTags.filter(({ tag_id }) => !req.body.tagIds.includes(tag_id)).map(({ id }) => id);

      await Promise.all([
        ProductTag.destroy({ where: { id: tagsToRemove } }),
        ProductTag.bulkCreate(newTags),
      ]);
    }
    res.status(200).json({ message: 'Product updated successfully!' });
  } catch (err) {
    res.status(400).json(err);
  }
});

// Delete product by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.destroy({ where: { id: req.params.id } });
    if (!deletedProduct) {
      return res.status(404).json({ message: 'No product found with this ID!' });
    }
    res.status(200).json({ message: 'Product deleted successfully!' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
