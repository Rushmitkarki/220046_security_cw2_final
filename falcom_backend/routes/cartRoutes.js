const { authGuard, adminGuard } = require('../middleware/authGuard');
 
const cartController = require('../controllers/cartController');
 
const router = require('express').Router();
 
// Add a product to the cart
router.post('/add_to_cart',authGuard,cartController.addToCart);
 
// Remove a product from the cart
router.delete('/remove_from_cart/:id', authGuard, cartController.removeFromCart);
 
// Get the cart
router.get('/get_cart', authGuard, cartController.getActiveCart);

//Update the status
router.put('/update_status',authGuard,cartController.updateStatus)

// Update the quantity of the product in the cart
router.put('/update_quantity', authGuard, cartController.updateQuantity);
 
module.exports = router;