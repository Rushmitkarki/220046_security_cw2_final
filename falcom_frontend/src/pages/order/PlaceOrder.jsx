import React, { useEffect, useState } from "react";
import {
  placeOrderApi,
  initializeKhaltiPaymentApi,
  updateStatusApi,
  getCartApi,
  getCurrentUserApi,
} from "../../apis/Api";
import { toast } from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify"; // For sanitizing HTML
import validator from "validator"; // For sanitizing inputs

const PlaceOrder = () => {
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [user, setUser] = useState(null); // State to store user details
  const params = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phoneNumber: "",
    deliveryFee: 40.0,
  });

  // Fetch the current user's details
  const fetchCurrentUser = async () => {
    try {
      const response = await getCurrentUserApi();
      if (response.data.success) {
        setUser(response.data.user);
        // Auto-fill form fields if user data exists
        setFormData((prev) => ({
          ...prev,
          firstName: DOMPurify.sanitize(response.data.user.firstName || ""),
          lastName: DOMPurify.sanitize(response.data.user.lastName || ""),
          email: DOMPurify.sanitize(response.data.user.email || ""),
          street: DOMPurify.sanitize(response.data.user.street || ""),
          city: DOMPurify.sanitize(response.data.user.city || ""),
          state: DOMPurify.sanitize(response.data.user.state || ""),
          zipCode: DOMPurify.sanitize(response.data.user.zipCode || ""),
          country: DOMPurify.sanitize(response.data.user.country || ""),
          phone: DOMPurify.sanitize(response.data.user.phoneNumber || ""),
        }));
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Failed to fetch user details.");
    }
  };

  // Fetch the user's cart
  const fetchCart = async () => {
    try {
      const res = await getCartApi();
      if (res.status === 200 && res.data && res.data.products) {
        const cartItems = res.data.products.map((item) => ({
          ...item,
          quantity: item.quantity,
        }));
        setCart(cartItems);
      }
    } catch (error) {
      console.error("Invalid cart data", error);
      toast.error("Invalid cart data.");
    }
  };

  useEffect(() => {
    fetchCurrentUser(); // Fetch user details on component mount
    fetchCart(); // Fetch cart details on component mount
  }, []);

  useEffect(() => {
    const total = cart.reduce(
      (acc, item) => acc + item.productId.productPrice * item.quantity,
      0
    );
    setSubtotal(total);
  }, [cart]);

  // Handle input changes and sanitize inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = DOMPurify.sanitize(value); // Sanitize input
    setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
  };

  // Validate order data
  const validateOrderData = () => {
    const {
      firstName,
      lastName,
      email,
      street,
      city,
      state,
      zipCode,
      country,
      phoneNumber,
    } = formData;
    if (
      !firstName ||
      !lastName ||
      !email ||
      !street ||
      !city ||
      !state ||
      !zipCode ||
      !country ||
      !phoneNumber
    ) {
      toast.error("Please fill all the fields.");
      return false;
    }
    if (
      !cart.length ||
      cart.some(
        (product) =>
          !product.productId || !product.productId._id || product.quantity <= 0
      )
    ) {
      toast.error("No products added to the order or invalid product data.");
      return false;
    }
    return true;
  };

  // Handle payment initialization
  const handlePayment = async (orderId, totalPrice) => {
    try {
      const paymentResponse = await initializeKhaltiPaymentApi({
        orderId,
        totalPrice,
      });
      if (paymentResponse.data.success) {
        const paymentUrl = paymentResponse.data.payment.payment_url;
        window.location.href = paymentUrl;
      } else {
        toast.error("Failed to initialize payment. Please try again.");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error(
        "Error processing payment: " +
          (error.response?.data?.message || error.message || "Unknown error")
      );
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateOrderData()) return;

    const total = subtotal + formData.deliveryFee;
    const orderData = {
      carts: cart,
      totalPrice: total,
      name: DOMPurify.sanitize(formData.firstName + " " + formData.lastName),
      email: DOMPurify.sanitize(formData.email),
      street: DOMPurify.sanitize(formData.street),
      city: DOMPurify.sanitize(formData.city),
      state: DOMPurify.sanitize(formData.state),
      zipCode: DOMPurify.sanitize(formData.zipCode),
      country: DOMPurify.sanitize(formData.country),
      phone: DOMPurify.sanitize(formData.phoneNumber),
      payment: false,
    };

    try {
      const response = await placeOrderApi(orderData);
      if (response.data.success) {
        toast.success(response.data.message);

        const orderId = response.data.order_id;
        if (orderId) {
          await handlePayment(orderId, total);
          await updateStatusApi();
        } else {
          toast.error("Order ID not found in response.");
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(
        "Error placing order: " +
          (error.response?.data?.message || error.message || "Unknown error")
      );
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 bg-[rgb(51,51,51)] text-white p-8 md:p-12">
              <h2 className="text-3xl font-extrabold mb-8">Order Summary</h2>
              <div className="space-y-6">
                {cart.map((product, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <img
                      src={`https://localhost:5000/products/${product.productId.productImage}`}
                      alt={product.productId.productName}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-grow">
                      <h3 className="font-semibold">
                        {DOMPurify.sanitize(product.productId.productName)}
                      </h3>
                      <p className="text-gray-400">Qty: {product.quantity}</p>
                    </div>
                    <span className="font-bold">
                      $
                      {(
                        product.productId.productPrice * product.quantity
                      ).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-8 border-t border-gray-700">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mt-2 text-gray-400">
                  <span>Delivery Fee</span>
                  <span>${formData.deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mt-4 text-2xl font-bold">
                  <span>Total</span>
                  <span>${(subtotal + formData.deliveryFee).toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 p-8 md:p-12">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
                Delivery Details
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {Object.entries(formData).map(
                  ([key, value]) =>
                    key !== "deliveryFee" && (
                      <div key={key}>
                        <label
                          htmlFor={key}
                          className="block text-sm font-medium text-gray-700"
                        >
                          {key.charAt(0).toUpperCase() +
                            key.slice(1).replace(/[A-Z]/g, " $&")}
                        </label>
                        <input
                          id={key}
                          type={key === "email" ? "email" : "text"}
                          name={key}
                          value={value}
                          onChange={handleChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        />
                      </div>
                    )
                )}
                <div className="mt-8">
                  <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
                  >
                    Place Order and Pay
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
