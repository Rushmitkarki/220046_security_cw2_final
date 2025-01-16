const mongoose = require("mongoose");


const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  productCategory: {
    type: String,
    required: true,
  },
  productDescription: {
    type: String,
    required: true,
  },
  
  productImage: {
    type: String,
    required: true,

    // //testing
    // default:null,
  },
  productPrice: {
    type: Number,
    required: true,
  },
  productQuantity:{
    type:Number
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Product = mongoose.model("products", productSchema);

module.exports = Product;
