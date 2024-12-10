const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  ListProducts: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
      Quantity: Number,
    },
  ],
  OrderDate: Date,
});

const Order = mongoose.model("order", orderSchema);
module.exports = Order;
