const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  ProductName: String,
  ProductCode: String,
  Price: Number,
  Quantity: Number,
  SupplierID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "supplier",
  },
});
const Product = mongoose.model("product", productSchema);
module.exports = Product;
