// Import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Set up associations

// A product belongs to one category, but a category can have many products
Product.belongsTo(Category, {
  foreignKey: 'category_id',
  onDelete: 'CASCADE', // If a category is deleted, associated products are deleted
});

Category.hasMany(Product, {
  foreignKey: 'category_id',
  onDelete: 'CASCADE',
});

// A product can have many tags, and a tag can belong to many products (many-to-many relationship)
Product.belongsToMany(Tag, {
  through: ProductTag, // Join table for the many-to-many relationship
  foreignKey: 'product_id',
});

Tag.belongsToMany(Product, {
  through: ProductTag,
  foreignKey: 'tag_id',
});

// Export the models for use in other files
module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
