const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const productsCategorySchema = new mongoose.Schema({
  title: String,
  parent_id: {
    type: String,
    default: ""
  },
  slug: {
    type: String,
    slug: "title",
    unique: true
  },
  description: String,
  thumbnail: String,
  status: String,
  position: Number,
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date
}, {
  timestamps: true
});

const ProductsCategory = mongoose.model("ProductCategory", productsCategorySchema, "products-category")

module.exports = ProductsCategory;

