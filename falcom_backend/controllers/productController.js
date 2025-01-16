const path = require("path");
const productModel = require("../models/productModel");
const fs = require("fs");

const createProduct = async (req, res) => {
  console.log(req.body);
  console.log(req.files);

  // Destructuring the body
  const {
    productName,
    productCategory,
    productDescription,
    productPrice,
    productQuantity,
  } = req.body;

  // Validating the data
  if (
    !productName ||
    !productCategory ||
    !productDescription ||
    !productPrice ||
    !productQuantity
  ) {
    return res.status(400).json({
      success: false,
      message: "Please enter all fields!",
    });
  }

  // Validating the image
  if (!req.files || !req.files.productImage) {
    return res.status(400).json({
      success: false,
      message: "Please upload an image!",
    });
  }

  const { productImage } = req.files;

  // Upload the image
  // 1. Generate new image name
  const imageName = `${Date.now()}-${productImage.name}`;

  // 2. Make an upload path (/path/upload - directory)
  const imageUploadPath = path.join(
    __dirname,
    `../public/products/${imageName}`
  );

  // 3. Move to that directory (await, try catch)
  try {
    await productImage.mv(imageUploadPath);

    // save the product to the database
    const newProduct = new productModel({
      productName: productName,
      productCategory: productCategory,
      productDescription: productDescription,
      productPrice: productPrice,
      productQuantity: productQuantity,
      productImage: imageName,
    });

    const product = await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: "error",
    });
  }
};

// Fetch all products
const getAllProducts = async (req, res) => {
  try {
    const allProducts = await productModel.find({});

    res.status(201).json({
      success: true,
      message: "All products fetched successfully",
      products: allProducts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

// Get one product
const getOneProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      product: product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    // No product
    const product = await productModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    // If there is image
    if (req.files && req.files.productImage) {
      // Destructuring the body
      const { productImage } = req.files;

      // Upload image to /public/image
      // 1. Generate new image name
      const imageName = `${Date.now()}-${productImage.name}`;

      // 2. Make an upload path (/path/upload - directory)
      const imageUploadPath = path.join(
        __dirname,
        `../public/products/${imageName}`
      );

      // 3, Move to that directory
      await productImage.mv(imageUploadPath);

      // req.params.id  (id), req.body (productName, productCategory, productDescription, productPrice)
      req.body.productImage = imageName;

      // if image is uploaded and req.body is updated
      if (req.body.productImage) {
        const existingProduct = await productModel.findById(req.params.id);
        imagePath = path.join(
          __dirname,
          `../public/products/${existingProduct.productImage}`
        );

        // Delete the existing image
        fs.unlinkSync(imagePath);
      }
    }
    const updatedProduct = await productModel.findByIdAndUpdate(
      req.params.id,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Product updated successfully",
      updatedProduct: updatedProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.id);

    res.status(201).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

const getProductsPagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = req.query.limit || 10;

    const products = await productModel
      .find({})
      .skip((page - 1) * limit)
      .limit(limit);

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Products not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products: products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

const getProductCount = async (req, res) => {
  try {
    const productCount = await productModel.countDocuments({});

    res.status(200).json({
      success: true,
      message: "Product count fetched successfully",
      productCount: productCount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

// Search Products
const searchProducts = async (req, res) => {
  try {
    const searchQuery = req.query.q;
    const page = parseInt(req.query.page) || 1;
    const limit = req.query.limit || 10;

    const products = await productModel
      .find({
        productName: { $regex: searchQuery, $options: "i" },
      })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get Recommended Products
const getRecommendedProducts = async (req, res) => {
  const { category } = req.params;

  try {
    const recommendedProducts = await productModel
      .find({ productCategory: category })
      .limit(4); // Limit to 4 recommendations
    res.status(200).json({
      success: true,
      products: recommendedProducts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getOneProduct,
  updateProduct,
  deleteProduct,
  getProductsPagination,
  getProductCount,
  searchProducts,
  getRecommendedProducts,
};








//for test




// const path = require("path");
// const productModel = require("../models/productModel");
// const fs = require("fs");

// const createProduct = async (req, res) => {
//   console.log(req.body);
//   console.log(req.files);

//   // Destructuring the body
//   const {
//     productName,
//     productCategory,
//     productDescription,
//     productPrice,
//     productQuantity,
//   } = req.body;

//   // Validating the data
//   if (
//     !productName ||
//     !productCategory ||
//     !productDescription ||
//     !productPrice ||
//     !productQuantity
//   ) {
//     return res.status(400).json({
//       success: false,
//       message: "Please enter all fields!",
//     });
//   }

//   var imageName = null;

//   // Validating the image

//   // Upload the image
//   // 1. Generate new image name

//   // 3. Move to that directory (await, try catch)
//   try {
//     if (req.files && req.files.productImage) {
//       const { productImage } = req.files;
//       const imageName = `${Date.now()}-${productImage.name}`;

//       // 2. Make an upload path (/path/upload - directory)
//       const imageUploadPath = path.join(
//         __dirname,
//         `../public/products/${imageName}`
//       );
//       await productImage.mv(imageUploadPath);
//     }

//     // save the product to the database
//     const newProduct = new productModel({
//       productName: productName,
//       productCategory: productCategory,
//       productDescription: productDescription,
//       productPrice: productPrice,
//       productQuantity: productQuantity,
//       productImage: imageName,
//     });

//     const product = await newProduct.save();

//     res.status(201).json({
//       success: true,
//       message: "Product created successfully",
//       product: product, // Ensure this matches with your test expectations
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: "error",
//     });
//   }
// };

// // Fetch all products
// const getAllProducts = async (req, res) => {
//   try {
//     const allProducts = await productModel.find({});

//     res.status(201).json({
//       success: true,
//       message: "All products fetched successfully",
//       products: allProducts,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error,
//     });
//   }
// };

// // Get one product
// const getOneProduct = async (req, res) => {
//   try {
//     const product = await productModel.findById(req.params.id);
//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }
//     res.status(200).json({
//       success: true,
//       message: "Product fetched successfully",
//       product: product,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error,
//     });
//   }
// };

// const updateProduct = async (req, res) => {
//   try {
//     // No product
//     const product = await productModel.findById(req.params.id);

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }
//     // If there is image
//     if (req.files && req.files.productImage) {
//       // Destructuring the body
//       const { productImage } = req.files;

//       // Upload image to /public/image
//       // 1. Generate new image name
//       const imageName = `${Date.now()}-${productImage.name}`;

//       // 2. Make an upload path (/path/upload - directory)
//       const imageUploadPath = path.join(
//         __dirname,
//         `../public/products/${imageName}`
//       );

//       // 3, Move to that directory
//       await productImage.mv(imageUploadPath);

//       // req.params.id  (id), req.body (productName, productCategory, productDescription, productPrice)
//       req.body.productImage = imageName;

//       // if image is uploaded and req.body is updated
//       if (req.body.productImage) {
//         const existingProduct = await productModel.findById(req.params.id);
//         imagePath = path.join(
//           __dirname,
//           `../public/products/${existingProduct.productImage}`
//         );

//         // Delete the existing image
//         fs.unlinkSync(imagePath);
//       }
//     }
//     const updatedProduct = await productModel.findByIdAndUpdate(
//       req.params.id,
//       req.body
//     );

//     res.status(201).json({
//       success: true,
//       message: "Product updated successfully",
//       updatedProduct: updatedProduct,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error,
//     });
//   }
// };

// const deleteProduct = async (req, res) => {
//   try {
//     await productModel.findByIdAndDelete(req.params.id);

//     res.status(201).json({
//       success: true,
//       message: "Product deleted successfully",
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error,
//     });
//   }
// };

// const getProductsPagination = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = req.query.limit || 10;

//     const products = await productModel
//       .find({})
//       .skip((page - 1) * limit)
//       .limit(limit);

//     if (products.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Products not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Products fetched successfully",
//       products: products,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error,
//     });
//   }
// };

// const getProductCount = async (req, res) => {
//   try {
//     const productCount = await productModel.countDocuments({});

//     res.status(200).json({
//       success: true,
//       message: "Product count fetched successfully",
//       productCount: productCount,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error,
//     });
//   }
// };

// // Search Products
// const searchProducts = async (req, res) => {
//   try {
//     const searchQuery = req.query.q;
//     const page = parseInt(req.query.page) || 1;
//     const limit = req.query.limit || 10;

//     const products = await productModel
//       .find({
//         productName: { $regex: searchQuery, $options: "i" },
//       })
//       .skip((page - 1) * limit)
//       .limit(limit);

//     res.status(200).json({
//       success: true,
//       message: "Products fetched successfully",
//       products: products,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

// // Get Recommended Products
// const getRecommendedProducts = async (req, res) => {
//   const { category } = req.params;

//   try {
//     const recommendedProducts = await productModel
//       .find({ productCategory: category })
//       .limit(4); // Limit to 4 recommendations
//     res.status(200).json({
//       success: true,
//       products: recommendedProducts,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error,
//     });
//   }
// };

// module.exports = {
//   createProduct,
//   getAllProducts,
//   getOneProduct,
//   updateProduct,
//   deleteProduct,
//   getProductsPagination,
//   getProductCount,
//   searchProducts,
//   getRecommendedProducts,
// };
