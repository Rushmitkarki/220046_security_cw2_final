import React, { createContext, useReducer, useContext, useEffect } from "react";
import { getCartApi, addToCartApi, removeFromCartApi } from "../apis/Api";
import DOMPurify from "dompurify"; // Import DOMPurify

const CartContext = createContext();

// Sanitize cart items before storing them in the state
const sanitizeCartItem = (item) => {
  // Ensure item and item.product are defined
  if (!item || !item.product) {
    return {
      ...item,
      product: {
        _id: item?.product?._id || "", // Default to empty string if undefined
        name: "", // Default to empty string if undefined
        description: "", // Default to empty string if undefined
        image: "", // Default to empty string if undefined
      },
    };
  }

  return {
    ...item,
    product: {
      ...item.product,
      name: DOMPurify.sanitize(item.product.name || ""), // Sanitize product name
      description: DOMPurify.sanitize(item.product.description || ""), // Sanitize product description
      image: DOMPurify.sanitize(item.product.image || ""), // Sanitize image URL
    },
  };
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "SET_CART":
      console.log("Setting cart:", action.payload);
      // Sanitize all cart items before setting the state
      return (action.payload || []).map(sanitizeCartItem);
    case "ADD_TO_CART":
      // Sanitize the new item before adding it to the cart
      return [...state, sanitizeCartItem(action.payload)];
    case "REMOVE_FROM_CART":
      return state.filter((item) => item.product._id !== action.payload);
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await getCartApi();
        console.log("Fetched cart:", response.data.products);
        // Dispatch the sanitized cart data
        dispatch({ type: "SET_CART", payload: response.data.products });
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      }
    };

    fetchCart();
  }, []);

  const addToCart = async (productId, quantity) => {
    try {
      await addToCartApi({ productId, quantity });
      const response = await getCartApi();
      console.log("Updated cart after adding:", response.data.products);
      // Dispatch the sanitized cart data
      dispatch({ type: "SET_CART", payload: response.data.products });
    } catch (error) {
      console.error("Failed to add to cart:", error);
      throw error;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await removeFromCartApi(productId);
      const response = await getCartApi();
      console.log("Updated cart after removal:", response.data.products);
      // Dispatch the sanitized cart data
      dispatch({ type: "SET_CART", payload: response.data.products });
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      throw error;
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
