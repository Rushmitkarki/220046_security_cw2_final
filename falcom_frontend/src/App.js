import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import HomePage from "./pages/homepage/Homepage";
import AboutPage from "./pages/about/About";
import Navbar from "./components/Navbar";
import AdminDashboard from "./pages/admin/admin_dashboard/AdminDashboard";
import UpdateProduct from "./pages/admin/updateProduct/updateProduct";
import AdminRoutes from "./protected_routes/AdmiRoutes";
import UserRoutes from "./protected_routes/UserRoutes";
import Profile from "./pages/user/UserDashboard";
import ProductDetails from "./pages/product_details/ProductDetails";
import { CartProvider } from "./context/CartContext";
import usePreventBackToLogin from "./hooks/PreventBackToLogin";
import TyreAgeCalculator from "../src/pages/user/TyreAgeCalculator";
import PlaceOrder from "./pages/order/PlaceOrder";
import ViewOrder from "./pages/admin/admin_dashboard/viewOrder";

const AppRoutes = () => {
  usePreventBackToLogin(); // This hook is now called within a Router context

  return (
    <>
      <Navbar />
      <ToastContainer />
      <Routes>
        <Route path="/placeorder" element={<PlaceOrder />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<AboutPage />} />
        <Route element={<AdminRoutes />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/update/:id" element={<UpdateProduct />} />
          {/* <Route path="/admin/dashboard/orders" element={<ViewOrder />} /> */}
          {/* Add this line */}
        </Route>
        <Route element={<UserRoutes />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route
            path="/tyre-age-calculator"
            element={<TyreAgeCalculator />}
          />{" "}
          {/* Add this line */}
        </Route>
      </Routes>
    </>
  );
};

function App() {
  return (
    <CartProvider>
      <Router>
        <AppRoutes />
      </Router>
    </CartProvider>
  );
}

export default App;
