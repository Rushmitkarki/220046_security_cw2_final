import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { getCartApi, addToCartApi, removeFromCartApi } from '../apis/Api';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      console.log('Setting cart:', action.payload);
      return action.payload || [];
    case 'ADD_TO_CART':
      return [...state, action.payload];
    case 'REMOVE_FROM_CART':
      return state.filter(item => item.product._id !== action.payload);
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
        console.log('Fetched cart:', response.data.products);
        dispatch({ type: 'SET_CART', payload: response.data.products });
      } catch (error) {
        console.error('Failed to fetch cart:', error);
      }
    };

    fetchCart();
  }, []);

  const addToCart = async (productId, quantity) => {
    try {
      await addToCartApi({ productId, quantity });
      const response = await getCartApi();
      console.log('Updated cart after adding:', response.data.products);
      dispatch({ type: 'SET_CART', payload: response.data.products });
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await removeFromCartApi(productId);
      const response = await getCartApi();
      console.log('Updated cart after removal:', response.data.products);
      dispatch({ type: 'SET_CART', payload: response.data.products });
    } catch (error) {
      console.error('Failed to remove from cart:', error);
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