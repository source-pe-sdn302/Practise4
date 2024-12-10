const express = require("express");
const db = require("../models");
const { listenerCount } = require("../models/product");

const ApiRouter = express.Router();

ApiRouter.get("/products/by-supplier/:supplierId", async (req, res, next) => {
  try {
    const supplierId = req.params.supplierId;
    const products = await db.Product.find({ SupplierID: supplierId });

    res.status(200).json(
      products.map((p) => {
        return {
          ProductName: p.ProductName,
          ProductCode: p.ProductCode,
          Price: p.Price,
          Quantity: p.Quantity,
        };
      })
    );
  } catch (error) {
    res.status(500).json({
      error: {
        status: 500,
        message: error.message,
      },
    });
  }
});
function calTotalPrice(products) {
  let total = 0;
  products.forEach((p) => {
    total += p._id.Price * p.Quantity;
  });
  return total;
}
ApiRouter.get("/orders/:orderId", async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const order = await db.Order.findById(orderId).populate("ListProducts._id");
    res.status(200).json({
      OrderDate: order.OrderDate,
      Products: order.ListProducts.map((p) => {
        return {
          ProductName: p._id.ProductName,
          ProductCode: p._id.ProductCode,
          Quantity: p._id.Quantity,
          Price: p._id.Price,
        };
      }),
      TotalPrice: calTotalPrice(order.ListProducts),
    });
  } catch (error) {
    res.status(500).json({
      error: {
        status: 500,
        message: error.message,
      },
    });
  }
});

ApiRouter.post("/orders/create", async (req, res, next) => {
  try {
    const listProducts = req.body.ListProducts;

    for (const item of listProducts) {
      const existProduct = await db.Product.findById(item._id);

      if (existProduct.Quantity < item.Quantity) {
        return res.status(500).json({
          message: "Insufficient stock for product",
          ProductID: existProduct._id,
        });
      }
      await db.Product.updateOne(
        { _id: existProduct._id },
        {
          Quantity: existProduct.Quantity - item.Quantity,
        }
      );
    }
    const newOrder = await db.Order.create({
      ListProducts: listProducts,
      OrderDate: Date.now(),
    });
    res.status(200).json({
      ListProducts: newOrder.ListProducts,
      OrderDate: newOrder.OrderDate,
    });
  } catch (error) {
    res.status(500).json({
      error: {
        status: 500,
        message: error.message,
      },
    });
  }
});

module.exports = ApiRouter;
