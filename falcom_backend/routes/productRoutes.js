const router = require('express').Router();
const productController = require('../controllers/productController');
const { authGuard, adminGuard } = require('../middleware/authGuard');

router.post('/create', productController.createProduct);
router.get('/get_all_products', authGuard, productController.getAllProducts);
router.get('/get_one_product/:id', productController.getOneProduct, authGuard);
router.put('/update_product/:id', productController.updateProduct, adminGuard);
router.delete('/delete/:id', productController.deleteProduct, adminGuard);
router.get('/get_paginated_products', productController.getProductsPagination);
router.get('/get_products_count', productController.getProductCount);
router.get('/search', productController.searchProducts);
router.get('/recommend/:category', productController.getRecommendedProducts); // Add this line

module.exports = router;
