// export default Cart;
import React, { useState, useEffect } from "react";
import {
  getCartApi,
  removeFromCartApi,
  updateQuantityApi,
} from "../../apis/Api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

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

  // const handleQuantityChange = (index, change) => {
  //   const newQuantity = cart[index].quantity + change;
  //   if (newQuantity < 1) {
  //     toast.error("Quantity cannot be less than 1");
  //     return;
  //   }
  //   if (newQuantity > cart[index].productId.productQuantity) {
  //     toast.error("Out of Stock");
  //     return;
  //   }

  //   const newCart = [...cart];
  //   newCart[index].quantity = newQuantity;
  //   setCart(newCart);
  //   calculateSubtotal(newCart); // Recalculate subtotal after quantity change
  // };

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
              src={`http://localhost:5000/products/${item.productId.productImage}`}
              alt={item.productId.productName}
              className="w-24 h-24 object-cover rounded-lg mr-4"
            />
            <div className="flex-grow">
              <h2 className="text-xl font-bold mb-2">
                {item.productId.productName}
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
            {/* <Link to={`/placeorder/`+ cart}> */}
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
// import React, { useState, useEffect } from 'react';
// import { getCartApi, removeFromCartApi } from '../../apis/Api'; // Assuming these API functions are correctly defined
// import { toast } from 'react-toastify'; // For displaying notifications
// import { Link } from 'react-router-dom'; // For navigation
// import { ArrowRight } from 'lucide-react'; // For the right arrow icon

// const Cart = () => {
//   const [cart, setCart] = useState([]); // State to hold cart items
//   const [subtotal, setSubtotal] = useState(0); // State to hold subtotal

//   // Fetch cart items when the component mounts
//   useEffect(() => {
//     fetchCart();
//   }, []);

//   // Recalculate subtotal whenever cart state changes
//   useEffect(() => {
//     calculateSubtotal(cart);
//   }, [cart]);

//   // Fetch cart items from the API
//   const fetchCart = async () => {
//     try {
//       const res = await getCartApi();
//       if (res.status === 200 && res.data && res.data.products) {
//         const cartItems = res.data.products.map((item) => {
//           if (item.productId && item.productId.productPrice !== undefined) {
//             return {
//               ...item,
//               quantity: item.quantity
//             };
//           }
//           // Handle cases where productId or productPrice might be missing
//           console.warn(`Product with ID ${item.productId?._id} is missing price data`);
//           return null; // Exclude invalid items
//         }).filter(Boolean); // Remove any null items
//         setCart(cartItems);
//       } else {
//         setCart([]);
//       }
//     } catch (error) {
//       console.error("Error fetching cart", error);
//       setCart([]);
//     }
//   };

//   // Handle quantity change (increase or decrease)
//   const handleQuantityChange = (index, change) => {
//     const newQuantity = cart[index].quantity + change;
//     if (newQuantity < 1) {
//       toast.error("Quantity cannot be less than 1");
//       return;
//     }
//     if (newQuantity > cart[index].productId.productQuantity) {
//       toast.error("Out of Stock");
//       return;
//     }

//     const newCart = [...cart];
//     newCart[index].quantity = newQuantity;
//     setCart(newCart);
//   };

//   // Handle removing an item from the cart
//   const handleDeleteItem = async (id) => {
//     try {
//       const res = await removeFromCartApi(id);
//       if (res.status === 200) {
//         toast.success("Item removed from cart");
//         fetchCart(); // Refresh cart after removal
//       }
//     } catch (error) {
//       console.error("Error deleting item from cart", error);
//     }
//   };

//   // Calculate the subtotal of all items in the cart
//   const calculateSubtotal = (cartItems) => {
//     const total = cartItems.reduce((sum, item) => {

//   if (item.productId && item.productId.productPrice) {
//       return sum + item.productId.productPrice * item.quantity;
//     }
//     return sum; // If productPrice doesn't exist, don't add to the sum
//   }, 0);
//   setSubtotal(total);
//   };

//   return (
//     <div className="container mx-auto p-4 text-white">
//       <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
//       <div className="bg-gray-800 rounded-lg overflow-hidden">
//         {cart.map((item, index) => (
//           <div key={index} className="flex items-center border-b border-gray-700 p-4">
//             <img
//               src={`http://localhost:5000/products/${item.productId.productImage}`}
//               alt={item.productId.productName}
//               className="w-24 h-24 object-cover rounded-lg mr-4"
//             />
//             <div className="flex-grow">
//               <h2 className="text-xl font-bold mb-2">{item.productId.productName}</h2>
//               <p className="text-green-500 font-bold mb-2">NPR. {item.productId.productPrice}</p>
//               <div className="flex items-center">
//                 <button
//                   className="bg-blue-500 text-white font-bold py-1 px-2 rounded-full hover:bg-blue-600 mr-2"
//                   onClick={() => handleQuantityChange(index, -1)}
//                 >
//                   -
//                 </button>
//                 <p className="mr-2">Quantity: {item.quantity}</p>
//                 <button
//                   className="bg-blue-500 text-white font-bold py-1 px-2 rounded-full hover:bg-blue-600 mr-4"
//                   onClick={() => handleQuantityChange(index, 1)}
//                 >
//                   +
//                 </button>
//                 <button
//                   className="bg-red-500 text-white font-bold py-1 px-3 rounded-full hover:bg-red-600"
//                   onClick={() => handleDeleteItem(item._id)}
//                 >
//                   Remove
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//       {cart.length > 0 && (
//         <div className="mt-4 p-4 bg-gray-800 rounded-lg">
//           <h2 className="text-2xl font-bold mb-4">Subtotal: NPR. {subtotal}</h2>
//           <Link to={`/placeorder/${encodeURIComponent(JSON.stringify(cart))}`}>
//             <button className="w-full py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-lg font-semibold rounded-lg shadow-md hover:from-orange-500 hover:to-orange-600 transition-all duration-300 flex items-center justify-center space-x-2">
//               <span>Proceed to Checkout</span>
//               <ArrowRight size={20} />
//             </button>
//           </Link>
//         </div>
//       )}
//       {cart.length === 0 && (
//         <p className="text-center mt-4">Your cart is empty.</p>
//       )}
//     </div>
//   );
// };

// export default Cart;
