const mongoose = require("mongoose");
const supplierSchema = new mongoose.Schema({
  SupplierName: String,
});

const Supplier = mongoose.model("supplier", supplierSchema);
module.exports = Supplier;
