const mongoose = require("mongoose");
const Order = require("./order");
const Product = require("./product");
const Supplier = require("./supplier");
const db = {};
db.Order = Order;
db.Product = Product;
db.Supplier = Supplier;
// Define schema

module.exports = db;
