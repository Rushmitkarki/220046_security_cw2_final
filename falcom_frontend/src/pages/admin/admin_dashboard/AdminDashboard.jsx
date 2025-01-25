import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  createProductApi,
  deleteProductAPi,
  getAllProductsApi,
} from "../../../apis/Api";
import backgroundImage from "../../../assets/images/cliptire.png";
import ViewOrder from "./viewOrder";
import UserLog from "../userlog/UserLog";
import axios from "axios";

const AdminDashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("add-product");
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productImage, setProductImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [productNameError, setProductNameError] = useState("");
  const [productDescriptionError, setProductDescriptionError] = useState("");
  const [productPriceError, setProductPriceError] = useState("");
  const [productCategoryError, setProductCategoryError] = useState("");
  const [productImageError, setProductImageError] = useState("");
  const [productQuantityError, setProductQuantityError] = useState("");

  const [products, setProducts] = useState([]);
  const [productIdToDelete, setProductIdToDelete] = useState(null);
  const [csrfToken, setCsrfToken] = useState(null); // State to store CSRF token

  // Fetch CSRF token when the component mounts
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get(
          "https://localhost:5000/api/csrf-token",
          {
            withCredentials: true, // Include cookies
          }
        );
        setCsrfToken(response.data.csrfToken); // Store the CSRF token
      } catch (error) {
        console.error("Error fetching CSRF token:", error);
      }
    };

    fetchCsrfToken();
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const fetchProducts = () => {
    getAllProductsApi()
      .then((res) => {
        if (res.status === 201) {
          setProducts(res.data.products);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProductImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const validate = () => {
    let valid = true;
    if (productName.trim() === "") {
      setProductNameError("Product Name is required");
      valid = false;
    }
    if (productDescription.trim() === "") {
      setProductDescriptionError("Product Description is required");
      valid = false;
    }
    if (productPrice.trim() === "" || parseFloat(productPrice) < 0) {
      setProductPriceError("Product Price must be a non-negative number");
      valid = false;
    }
    if (productCategory.trim() === "") {
      setProductCategoryError("Product Category is required");
      valid = false;
    }
    if (productImage === "") {
      setProductImageError("Product Image is required");
      valid = false;
    }
    if (productQuantity.trim() === "" || parseInt(productQuantity) < 0) {
      setProductQuantityError("Product Quantity must be a non-negative number");
      valid = false;
    }
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("productDescription", productDescription);
    formData.append("productPrice", productPrice);
    formData.append("productCategory", productCategory);
    formData.append("productImage", productImage);
    formData.append("productQuantity", productQuantity);
    try {
      const response = await axios.post(
        "https://localhost:5000/api/product/create",
        formData,
        {
          headers: {
            "X-CSRF-Token": csrfToken,
          },
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        toast.success(response.data.message);
        fetchProducts();
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          toast.warning(error.response.data.message);
        } else if (error.response.status === 500) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong");
        }
      } else {
        toast.error("Something went wrong");
      }
    }

    // createProductApi(formData)
    //   .then((res) => {
    //     if (res.status === 201) {
    //       toast.success(res.data.message);
    //       fetchProducts();
    //     }
    //   })
    //   .catch((err) => {
    //     if (err.response) {
    //       if (err.response.status === 400) {
    //         toast.warning(err.response.data.message);
    //       } else if (err.response.status === 500) {
    //         toast.error(err.response.data.message);
    //       } else {
    //         toast.error("Something went wrong");
    //       }
    //     } else {
    //       toast.error("Something went wrong");
    //     }
    //   });
  };

  const handleDeleteClick = (id) => {
    setProductIdToDelete(id);
  };

  const handleDeleteConfirm = () => {
    if (productIdToDelete) {
      deleteProductAPi(productIdToDelete)
        .then((res) => {
          if (res.status === 201) {
            toast.success(res.data.message);
            setProductIdToDelete(null);
            setProducts(
              products.filter((product) => product._id !== productIdToDelete)
            );
            setActiveTab("view-product");
          }
        })
        .catch((err) => {
          if (err.response.status === 500) {
            toast.error(err.response.data.message);
          } else {
            toast.error("Something went wrong");
          }
        });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    toast.success("Logged out successfully");
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-[#211e21] text-white" : "bg-gray-100 text-gray-800"
      }`}
    >
      <nav className={`${isDarkMode ? "bg-[#211e21]" : "bg-white"} shadow-lg`}>
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1
            className={`text-4xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Admin Dashboard
          </h1>
          <div className="flex items-center">
            <span
              className={`mr-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}
            >
              {isDarkMode ? "Dark" : "Light"}
            </span>
            <div
              className={`w-14 h-7 flex items-center ${
                isDarkMode ? "bg-white" : "bg-[#211e21]"
              } rounded-full p-1 cursor-pointer`}
              onClick={toggleTheme}
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ease-in-out ${
                  isDarkMode ? "translate-x-7" : ""
                }`}
              ></div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="flex space-x-4 mb-8">
          {[
            "add-product",
            "view-product",
            "view-order",
            "user-log",
            "your-panel",
          ].map((tab) => (
            <button
              key={tab}
              className={`px-6 py-3 font-semibold rounded-lg transition-colors duration-200 ${
                activeTab === tab
                  ? isDarkMode
                    ? "bg-white text-gray-800"
                    : "bg-white text-gray-800"
                  : isDarkMode
                  ? "bg-[#211e21] text-white hover:bg-gray-800"
                  : "bg-white text-gray-800 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </button>
          ))}
        </div>

        {activeTab === "add-product" && (
          <div className="text-center">
            <h2
              className={`text-4xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-800"
              } mb-8`}
            >
              Press the '+' button to add your product
            </h2>
            <button
              type="button"
              className="w-40 h-40 text-8xl bg-white hover:bg-gray-100 text-gray-800 rounded-full shadow-lg transition-transform duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
              }}
            >
              +
            </button>
          </div>
        )}

        {activeTab === "view-product" && (
          <div
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } shadow-md rounded-lg overflow-hidden`}
          >
            <table className="w-full">
              <thead
                className={`${
                  isDarkMode
                    ? "bg-gray-700 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                <tr>
                  {[
                    "Image",
                    "Name",
                    "Description",
                    "Price",
                    "Category",
                    "Quantity",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  isDarkMode ? "divide-gray-700" : "divide-gray-200"
                }`}
              >
                {products.map((product) => (
                  <tr key={product._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={`https://localhost:5000/products/${product.productImage}`}
                        alt={product.productName}
                        className="w-16 h-16 rounded-md object-cover"
                      />
                    </td>
                    <td className="px-6 py-4">{product.productName}</td>
                    <td className="px-6 py-4">{product.productDescription}</td>
                    <td className="px-6 py-4">{product.productPrice}</td>
                    <td className="px-6 py-4">{product.productCategory}</td>
                    <td className="px-6 py-4">{product.productQuantity}</td>
                    <td className="px-6 py-4">
                      <Link
                        to={"/admin/update/" + product._id}
                        className="bg-white hover:bg-gray-100 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="bg-white hover:bg-gray-100 text-gray-800 font-bold py-2 px-4 rounded"
                        onClick={() => handleDeleteClick(product._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "view-order" && (
          <div
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } shadow-md rounded-lg overflow-hidden`}
          >
            <ViewOrder />
          </div>
        )}

        {activeTab === "user-log" && (
          <div
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } shadow-md rounded-lg overflow-hidden`}
          >
            <UserLog />
          </div>
        )}

        {activeTab === "your-panel" && (
          <div
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } shadow-md rounded-lg p-6`}
          >
            <h2
              className={`text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-800"
              } mb-4`}
            >
              Your Panel
            </h2>
            <p
              className={`${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              } mb-6`}
            >
              Here you can add any additional admin functionalities or
              information.
            </p>
            <ul
              className={`list-decimal ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              } mb-6 ml-6`}
            >
              <li>Manage product listings including add, edit, and delete.</li>
              <li>View and manage customer orders.</li>
              <li>Update product inventory and monitor stock levels.</li>
              <li>Set product pricing and promotional discounts.</li>
              <li>Generate sales and performance reports.</li>
              <li>Handle customer inquiries and feedback.</li>
              <li>Ensure website security and user data protection.</li>
              <li>Monitor website traffic and user behavior analytics.</li>
              <li>Collaborate with marketing for promotional strategies.</li>
              <li>Manage and assign roles to other admin users.</li>
              <li>Stay updated with e-commerce trends and technologies.</li>
            </ul>
            <button
              onClick={handleLogout}
              className="bg-white hover:bg-gray-100 text-gray-800 font-bold py-2 px-4 rounded transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Modal for adding product */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div
            className={`modal-content ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-xl`}
          >
            <div
              className={`modal-header ${
                isDarkMode ? "bg-gray-700" : "bg-white"
              } p-4 border-b ${
                isDarkMode ? "border-gray-600" : "border-gray-200"
              }`}
            >
              <h5
                className={`modal-title text-xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
                id="exampleModalLabel"
              >
                Add a Product
              </h5>
              <button
                type="button"
                className={`close ${
                  isDarkMode ? "text-white" : "text-gray-600"
                } hover:${isDarkMode ? "text-gray-300" : "text-gray-800"}`}
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body p-6">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="productName"
                    className={`block ${
                      isDarkMode ? "text-white" : "text-gray-700"
                    } text-sm font-bold mb-2`}
                  >
                    Product Name
                  </label>
                  <input
                    type="text"
                    className={`shadow appearance-none border rounded w-full py-2 px-3 ${
                      isDarkMode
                        ? "text-white bg-gray-700"
                        : "text-gray-700 bg-white"
                    } leading-tight focus:outline-none focus:shadow-outline`}
                    id="productName"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                  />
                  {productNameError && (
                    <p className="text-red-500 text-xs italic">
                      {productNameError}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="productDescription"
                    className={`block ${
                      isDarkMode ? "text-white" : "text-gray-700"
                    } text-sm font-bold mb-2`}
                  >
                    Product Description
                  </label>
                  <textarea
                    className={`shadow appearance-none border rounded w-full py-2 px-3 ${
                      isDarkMode
                        ? "text-white bg-gray-700"
                        : "text-gray-700 bg-white"
                    } leading-tight focus:outline-none focus:shadow-outline`}
                    id="productDescription"
                    rows="3"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                  ></textarea>
                  {productDescriptionError && (
                    <p className="text-red-500 text-xs italic">
                      {productDescriptionError}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="productQuantity"
                    className={`block ${
                      isDarkMode ? "text-white" : "text-gray-700"
                    } text-sm font-bold mb-2`}
                  >
                    Product Quantity
                  </label>
                  <input
                    type="number"
                    className={`shadow appearance-none border rounded w-full py-2 px-3 ${
                      isDarkMode
                        ? "text-white bg-gray-700"
                        : "text-gray-700 bg-white"
                    } leading-tight focus:outline-none focus:shadow-outline`}
                    id="productQuantity"
                    value={productQuantity}
                    onChange={(e) => setProductQuantity(e.target.value)}
                  />
                  {productQuantityError && (
                    <p className="text-red-500 text-xs italic">
                      {productQuantityError}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="productPrice"
                    className={`block ${
                      isDarkMode ? "text-white" : "text-gray-700"
                    } text-sm font-bold mb-2`}
                  >
                    Product Price
                  </label>
                  <input
                    type="text"
                    className={`shadow appearance-none border rounded w-full py-2 px-3 ${
                      isDarkMode
                        ? "text-white bg-gray-700"
                        : "text-gray-700 bg-white"
                    } leading-tight focus:outline-none focus:shadow-outline`}
                    id="productPrice"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                  />
                  {productPriceError && (
                    <p className="text-red-500 text-xs italic">
                      {productPriceError}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="productCategory"
                    className={`block ${
                      isDarkMode ? "text-white" : "text-gray-700"
                    } text-sm font-bold mb-2`}
                  >
                    Product Category
                  </label>
                  <select
                    className={`shadow appearance-none border rounded w-full py-2 px-3 ${
                      isDarkMode
                        ? "text-white bg-gray-700"
                        : "text-gray-700 bg-white"
                    } leading-tight focus:outline-none focus:shadow-outline`}
                    id="productCategory"
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value)}
                  >
                    <option value="">Select a category</option>
                    <option value="Tyre Radial Tubeless">
                      Tyre Radial Tubeless
                    </option>
                    <option value="Tyre with Tube Nylon">
                      Tyre with Tube Nylon
                    </option>
                    <option value="Tube">Tube</option>
                    <option value="Lubricants">Lubricants</option>
                  </select>
                  {productCategoryError && (
                    <p className="text-red-500 text-xs italic">
                      {productCategoryError}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="productImage"
                    className={`block ${
                      isDarkMode ? "text-white" : "text-gray-700"
                    } text-sm font-bold mb-2`}
                  >
                    Product Image
                  </label>
                  <input
                    type="file"
                    className={`shadow appearance-none border rounded w-full py-2 px-3 ${
                      isDarkMode
                        ? "text-white bg-gray-700"
                        : "text-gray-700 bg-white"
                    } leading-tight focus:outline-none focus:shadow-outline`}
                    id="productImage"
                    onChange={handleImageChange}
                  />
                  {productImageError && (
                    <p className="text-red-500 text-xs italic">
                      {productImageError}
                    </p>
                  )}
                </div>

                {previewImage && (
                  <div className="mb-4">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="max-w-full h-auto rounded-lg shadow-md"
                    />
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-white hover:bg-gray-100 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="bg-white hover:bg-gray-100 text-gray-800 font-bold py-2 px-4 rounded"
                  >
                    Save changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {productIdToDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
          <div
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full`}
          >
            <div
              className={`${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } px-4 pt-5 pb-4 sm:p-6 sm:pb-4`}
            >
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg
                    className="h-6 w-6 text-red-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3
                    className={`text-lg leading-6 font-medium ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                    id="modal-title"
                  >
                    Delete Product
                  </h3>
                  <div className="mt-2">
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      Are you sure you want to delete this product? This action
                      cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`${
                isDarkMode ? "bg-gray-700" : "bg-gray-50"
              } px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse`}
            >
              <button
                type="button"
                className="bg-white hover:bg-gray-100 text-gray-800 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium sm:ml-3 sm:w-auto sm:text-sm"
                onClick={handleDeleteConfirm}
              >
                Delete
              </button>
              <button
                type="button"
                className={`mt-3 w-full inline-flex justify-center rounded-md border ${
                  isDarkMode
                    ? "border-gray-500 hover:bg-gray-600"
                    : "border-gray-300 hover:bg-gray-50"
                } shadow-sm px-4 py-2 bg-white text-gray-800 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm`}
                onClick={() => setProductIdToDelete(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
