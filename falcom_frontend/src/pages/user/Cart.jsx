import React, { useState, useEffect } from "react";
import {
  getCartApi,
  removeFromCartApi,
  updateQuantityApi,
} from "../../apis/Api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import DOMPurify from "dompurify"; // Import DOMPurify

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [stringCart, setStringCart] = useState([]);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await getCartApi();
      if (res.status === 200 && res.data && res.data.products) {
        const cartItems = res.data.products.map((item) => ({
          ...item,
          quantity: item.quantity,
          productId: {
            ...item.productId,
            productName: DOMPurify.sanitize(item.productId.productName || ""), // Sanitize product name
            productDescription: DOMPurify.sanitize(
              item.productId.productDescription || ""
            ), // Sanitize product description
            productImage: DOMPurify.sanitize(item.productId.productImage || ""), // Sanitize image URL
          },
        }));
        setCart(cartItems);
        setStringCart(JSON.stringify(cartItems));

        calculateSubtotal(cartItems); // Calculate subtotal initially
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error("Error fetching cart", error);
      setCart([]);
    }
  };

  const handleQuantityChange = async (index, change) => {
    const newQuantity = cart[index].quantity + change;

    if (newQuantity < 1) {
      toast.error("Quantity cannot be less than 1");
      return;
    }

    if (newQuantity > cart[index].productId.productQuantity) {
      toast.error("Out of Stock");
      return;
    }

    // Call the API through the helper function
    const response = await updateQuantityApi({
      productId: cart[index].productId._id,
      qquantity: newQuantity,
    });

    if (response.data.success) {
      // Update the cart in the frontend only if the API call is successful
      const newCart = [...cart];
      newCart[index].quantity = newQuantity;
      setCart(newCart);
      calculateSubtotal(newCart); // Recalculate subtotal after quantity change
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      const res = await removeFromCartApi(id);
      if (res.status === 200) {
        toast.success("Item removed from cart");
        fetchCart();
      }
    } catch (error) {
      console.error("Error deleting item from cart", error);
    }
  };

  const calculateSubtotal = (cartItems) => {
    const total = cartItems.reduce((sum, item) => {
      return sum + item.productId.productPrice * item.quantity;
    }, 0);
    setSubtotal(total);
  };

  return (
    <div className="container mx-auto p-4 text-white">
      <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        {cart.map((item, index) => (
          <div
            key={index}
            className="flex items-center border-b border-gray-700 p-4"
          >
            <img
              src={`https://localhost:5000/products/${item.productId.productImage}`}
              alt={item.productId.productName}
              className="w-24 h-24 object-cover rounded-lg mr-4"
            />
            <div className="flex-grow">
              <h2 className="text-xl font-bold mb-2">
                {item.productId.productName} {/* Already sanitized */}
              </h2>
              <p className="text-green-500 font-bold mb-2">
                NPR. {item.productId.productPrice}
              </p>
              <div className="flex items-center">
                <button
                  className="bg-blue-500 text-white font-bold py-1 px-2 rounded-full hover:bg-blue-600 mr-2"
                  onClick={() => handleQuantityChange(index, -1)}
                >
                  -
                </button>
                <p className="mr-2">Quantity: {item.quantity}</p>
                <button
                  className="bg-blue-500 text-white font-bold py-1 px-2 rounded-full hover:bg-blue-600 mr-4"
                  onClick={() => handleQuantityChange(index, 1)}
                >
                  +
                </button>
                <button
                  className="bg-red-500 text-white font-bold py-1 px-3 rounded-full hover:bg-red-600"
                  onClick={() => handleDeleteItem(item._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {cart.length > 0 && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Subtotal: NPR. {subtotal}</h2>
          <Link to={`/placeorder`}>
            <button className="w-full py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-lg font-semibold rounded-lg shadow-md hover:from-orange-500 hover:to-orange-600 transition-all duration-300 flex items-center justify-center space-x-2">
              <span>Proceed to Checkout</span>
              <ArrowRight size={20} />
            </button>
          </Link>
        </div>
      )}
      {cart.length === 0 && (
        <p className="text-center mt-4">Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;
