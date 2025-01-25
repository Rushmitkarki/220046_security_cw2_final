import axios from "axios";
// import { csrfToken } from "../utils/csrfToken";

// Creating backend config
const Api = axios.create({
  baseURL: "https://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

const config = {
  headers: {
    authorization: `Bearer ${localStorage.getItem("token")}`,
  },
};
const jsonConfig = {
  headers: {
    authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  },
};

// Test API
export const testApi = () => Api.get("/test");

// Create API
export const registerUserApi = (data) => Api.post("/api/user/create", data);

// Login API
export const loginUserApi = (data) => Api.post("/api/user/login", data);

export const verifyMfaCodeApi = (data) => Api.post("/api/user/verifyOTP", data);

// create product API
export const createProductApi = (data) => Api.post("/api/product/create", data);

// get all products API
export const getAllProductsApi = () =>
  Api.get("/api/product/get_all_products", config);

// get single product API
export const getSingleProductApi = (id) =>
  Api.get(`/api/product/get_one_product/${id}`, config);

// get recommended products API
export const getRecommendedProductsApi = (category) =>
  Api.get(`/api/product/recommend/${category}`, config);

export const deleteProductAPi = (id) => {
  return Api.delete(`/api/product/delete/${id}`, config);
};

export const updateProductApi = (id, data) => {
  return Api.put(`/api/product/update_product/${id}`, data, config);
};

// Updated pagination function to include limit parameter
export const pagination = (page, limit = 8) => {
  return Api.get(`/api/product/get_paginated_products`, {
    ...config,
    params: {
      page,
      limit,
    },
  });
};

export const getProductCount = () => {
  return Api.get("/api/product/get_products_count", config);
};
// forgetpassword
export const forgotPasswordApi = (data) =>
  Api.post("/api/user/forgot_password", data);

// verify otp and reset password
export const verifyOtpAndResetPasswordApi = (data) =>
  Api.post("/api/user/verify_otp", data);

// Search products API
export const searchProductsApi = (query) =>
  Api.get(`/api/product/search?q=${query}`, config);

// For cart
// Get Cart API
export const getCartApi = () => Api.get("/api/cart/get_cart", config);

// Add to Cart API
export const addToCartApi = (data) =>
  Api.post("/api/cart/add_to_cart", data, config);

// Remove from Cart API
export const removeFromCartApi = (id) =>
  Api.put(`/api/cart/remove_from_cart/${id}`, config);

// update quantity in cart api
export const updateQuantityApi = (data) =>
  Api.put(`/api/cart/update_quantity`, data, config);

// update cart status
export const updateCartStatusApi = (data) =>
  Api.put("/api/cart/update_status", data, config);

//=========================== Review Apis ===========================

// add review api
export const addReviewApi = (data) =>
  Api.post("/api/review/post_reviews", data, config);

// get reviews api
export const getReviewsApi = (ProductId) =>
  Api.get(`/api/review/get_reviews/${ProductId}`, config);

// get reviews by product and user api
export const getReviewsByProductAndUserApi = (ProductId) =>
  Api.get(`/api/review/get_reviews_by_user_and_product/${ProductId}`, config);

// get average rating api
export const getAverageRatingApi = (ProductId) =>
  Api.get(`/api/review/get_average_rating/${ProductId}`, config);

//update review api
export const updateReviewApi = (id, data) =>
  Api.put(`/api/review/update_reviews/${id}`, data, config);

// google login
export const googleLoginApi = (data) => Api.post("/api/user/googleLogin", data);

// get by email
export const getUserByGoogleEmail = (data) =>
  Api.post(`/api/user/getUserByGoogle`, data);

// get current user api
export const getCurrentUserApi = () => Api.get("/api/user/current", config);

// edit user profile api
export const editUserProfileApi = (data) =>
  Api.put("/api/user/update", data, config);

//Upload Profile Picture Api
export const uploadProfilePictureApi = (data) =>
  Api.post("/api/user/profile_picture", data);

//=========================== Order Apis ===========================
//place order api
export const placeOrderApi = (data) =>
  Api.post("/api/order/place_order", data, jsonConfig);

// get single order api
export const getSingleOrderApi = (id) =>
  Api.get(`/api/order/get_single_order/${id}`, config);

// get all orders api
export const getAllOrdersApi = () =>
  Api.get("/api/order/get_all_orders", config);

// order status update api
export const updateOrderStatusApi = (id, data) =>
  Api.post(`/api/order/update_order_status/${id}`, data, config);

export const updateStatusApi = () =>
  Api.put(`/api/cart/update_status`, "", config);

// get orders by user api
export const getOrdersByUserApi = () =>
  Api.get("/api/order/get_orders_by_user", config);

// Function to initialize Khalti payment
export const initializeKhaltiPaymentApi = (data) =>
  Api.post("api/khalti/initialize-khalti", data);

// Function to verify Khalti payment
export const verifyKhaltiPaymentApi = (params) =>
  Api.get("/api/khalti/complete-khalti-payment", { params });

const KhaltiApi = axios.create({
  baseURL: "https://test-pay.khalti.com/",
  headers: {
    "Content-Type": "application/json",
    authorization: `key 5826720c2d604a8eae0be763afaabb41`,
  },
});

export const initiateKhaltiPayment = (data) =>
  KhaltiApi.post("api/v2/epayment/initiate/", data);

// verfy the registerotp
export const verifyRegistrationOtpApi = (data) =>
  Api.post("/api/user/verify_registration_otp", data);

// refresh token
export const refreshTokenApi = (userId) =>
  Api.post(`/api/user/refresh-token/${userId}`);

// getuser activity
export const getUserActivityLogs = (config) =>
  Api.get("/api/admin/activities", config);

// deleteuser
export const deleteUserApi = (userId) =>
  Api.delete(`/api/admin/delete_user/${userId}`, config);

const fetchCsrfToken = async () => {
  try {
    const response = await axios.get("https://localhost:5000/api/csrf-token", {
      withCredentials: true, // Include cookies
    });
    return response.data.csrfToken; // Return the CSRF token
  } catch (error) {
    console.error("Error fetching CSRF token:", error);
    return null;
  }
};

// Store the CSRF token in a variable or state
let csrfToken = null;

// Fetch and store the CSRF token when the app loads
fetchCsrfToken().then((token) => {
  csrfToken = token;
  console.log("CSRF Token:", csrfToken);
});
