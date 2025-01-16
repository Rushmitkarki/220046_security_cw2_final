



import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getProductCount, pagination, searchProductsApi } from "../../apis/Api";
import bestpriceImage from '../../assets/images/bestprice.png';
import toptierImage from '../../assets/images/toptier.png';
import logImage from '../../assets/images/lambofgod.png';
import ProductCard from "../../components/ProductCard";
import Cart from "./Cart";
import TyreAgeCalculator from './TyreAgeCalculator';
import EditProfile from './EditProfile';
import {
  FaShoppingCart,
  FaDollarSign,
  FaCalculator,
  FaUser,
} from "react-icons/fa";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [activeTab, setActiveTab] = useState("shopNow");
  const [searchQuery, setSearchQuery] = useState(new URLSearchParams(location.search).get('search') || '');

  useEffect(() => {
    if (activeTab === "shopNow") {
      if (searchQuery) {
        searchProductsApi(searchQuery)
          .then((res) => {
            setProducts(res.data.products);
            setTotalPages(1); // Assuming search results are less and can fit on one page
          })
          .catch((err) => {
            setError(err.response.data.message);
          });
      } else {
        getProductCount()
          .then((res) => {
            const count = res.data.productCount;
            setTotalPages(Math.ceil(count / 8)); // Adjusted for 8 products per page
          })
          .catch((err) => {
            setError(err.response.data.message);
          });

        pagination(page, 8) // Fetch the first 8 products
          .then((res) => {
            setProducts(res.data.products);
          })
          .catch((err) => {
            setError(err.response.data.message);
          });
      }
    }
  }, [page, activeTab, searchQuery]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const handlePagination = (id) => {
    setPage(id);
    pagination(id, 8) // Adjusted for 8 products per page
      .then((res) => {
        setProducts(res.data.products);
      })
      .catch((err) => {
        setError(err.response.data.message);
      });
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4 text-white">WeWheels</h1>

        {/* Tabs */}
        <div className="mb-4">
          <ul className="flex space-x-4">
            <li>
              <button
                className={`flex items-center py-2 px-4 font-semibold shadow-md ${
                  activeTab === "shopNow"
                    ? "bg-black text-white"
                    : "bg-red-500 text-white hover:bg-green-500 hover:text-white"
                }`}
                onClick={() => setActiveTab("shopNow")}
              >
                <FaShoppingCart className="mr-2" /> Shop Now
              </button>
            </li>
            <li>
              <button
                className={`flex items-center py-2 px-4 font-semibold shadow-md ${
                  activeTab === "cart"
                    ? "bg-black text-white"
                    : "bg-red-500 text-white hover:bg-green-500 hover:text-white"
                }`}
                onClick={() => setActiveTab("cart")}
              >
                <FaShoppingCart className="mr-2" /> Cart
              </button>
            </li>
            <li>
              {/* <button
                className={`flex items-center py-2 px-4 font-semibold shadow-md ${
                  activeTab === "billing" ? "bg-black text-white" : "bg-red-500 text-white hover:bg-green-500 hover:text-white"
                }`}
                onClick={() => setActiveTab("billing")}
              >
                <FaDollarSign className="mr-2" /> Billing Info
              </button> */}
            </li>
            <li>
              <button
                className={`flex items-center py-2 px-4 font-semibold shadow-md ${
                  activeTab === "calculator"
                    ? "bg-black text-white"
                    : "bg-red-500 text-white hover:bg-green-500 hover:text-white"
                }`}
                onClick={() => setActiveTab("calculator")}
              >
                <FaCalculator className="mr-2" /> Tyre Age Calculator
              </button>
            </li>
            <li>
              <button
                className={`flex items-center py-2 px-4 font-semibold shadow-md ${
                  activeTab === "profile"
                    ? "bg-black text-white"
                    : "bg-red-500 text-white hover:bg-green-500 hover:text-white"
                }`}
                onClick={() => setActiveTab("profile")}
              >
                <FaUser className="mr-2" /> Profile
              </button>
            </li>
          </ul>
        </div>

        {/* Tab Content */}
        <div className="mb-4">
          {activeTab === "shopNow" && (
            <>
              {/* Shop Now Section */}
              <div className="relative mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search for products..."
                />
                <button
                  onClick={() =>
                    searchProductsApi(searchQuery).then((res) =>
                      setProducts(res.data.products)
                    )
                  }
                  className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.65 10.65a7.5 7.5 0 015.9 5.9z"
                    ></path>
                  </svg>
                </button>
              </div>

              <div
                id="carouselExampleCaptions"
                className="carousel slide"
                data-bs-ride="carousel"
                data-bs-interval="2000"
              >
                <div className="carousel-indicators">
                  <button
                    type="button"
                    data-bs-target="#carouselExampleCaptions"
                    data-bs-slide-to="0"
                    className="active"
                    aria-current="true"
                    aria-label="Slide 1"
                  ></button>
                  <button
                    type="button"
                    data-bs-target="#carouselExampleCaptions"
                    data-bs-slide-to="1"
                    aria-label="Slide 2"
                  ></button>
                  <button
                    type="button"
                    data-bs-target="#carouselExampleCaptions"
                    data-bs-slide-to="2"
                    aria-label="Slide 3"
                  ></button>
                </div>
                <div className="carousel-inner">
                  <div className="carousel-item active">
                    <img
                      src={bestpriceImage}
                      className="d-block w-100 mx-auto rounded-lg"
                      alt="Best Price"
                    />
                    <div className="carousel-caption d-none d-md-block">
                      {/* <h5>First slide label</h5>
                      <p>Some representative placeholder content for the first slide.</p> */}
                    </div>
                  </div>
                  <div className="carousel-item">
                    <img
                      src={toptierImage}
                      className="d-block w-100 mx-auto rounded-lg"
                      alt="Top Tier"
                    />
                    <div className="carousel-caption d-none d-md-block">
                      {/* <h5>Second slide label</h5>
                      <p>Some representative placeholder content for the second slide.</p> */}
                    </div>
                  </div>
                  <div className="carousel-item">
                    <img
                      src={logImage}
                      className="d-block w-100 mx-auto rounded-lg"
                      alt="log"
                    />
                    <div className="carousel-caption d-none d-md-block">
                      {/* <h5>Third slide label</h5>
                      <p>Some representative placeholder content for the third slide.</p> */}
                    </div>
                  </div>
                </div>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#carouselExampleCaptions"
                  data-bs-slide="prev"
                >
                  <span
                    className="carousel-control-prev-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#carouselExampleCaptions"
                  data-bs-slide="next"
                >
                  <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>

              {/* Available Products */}
              <h2 className="mt-5 text-white">Available Products</h2>
              <div className="mb-5 pb-5">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {error ? (
                    <h1 className="text-red-500">{error}</h1>
                  ) : (
                    products.map((product) => (
                      <div key={product._id}>
                        <ProductCard product={product} />
                      </div>
                    ))
                  )}
                </div>
                <nav aria-label="Page navigation example" className="mt-4">
                  <ul className="pagination justify-content-center space-x-2">
                    <li className="page-item">
                      <button
                        className={`page-link ${
                          page === 1
                            ? "bg-black text-white cursor-not-allowed"
                            : "bg-black text-white hover:bg-green-500 hover:text-white"
                        }`}
                        onClick={() => {
                          handlePagination(1);
                        }}
                        disabled={page === 1}
                      >
                        First
                      </button>
                    </li>
                    <li className="page-item">
                      <button
                        className={`page-link ${
                          page === 1
                            ? "bg-black text-white cursor-not-allowed"
                            : "bg-black text-white hover:bg-green-500 hover:text-white"
                        }`}
                        onClick={() => {
                          handlePagination(page - 1);
                        }}
                        disabled={page === 1}
                      >
                        Previous
                      </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <li className="page-item" key={i}>
                        <button
                          className={`page-link ${
                            page === i + 1
                              ? "bg-red-500 text-white"
                              : "bg-black text-white hover:bg-green-500 hover:text-white"
                          }`}
                          onClick={() => {
                            handlePagination(i + 1);
                          }}
                        >
                          {i + 1}
                        </button>
                      </li>
                    ))}
                    <li className="page-item">
                      <button
                        className={`page-link ${
                          page === totalPages
                            ? "bg-black text-white cursor-not-allowed"
                            : "bg-black text-white hover:bg-green-500 hover:text-white"
                        }`}
                        onClick={() => {
                          handlePagination(page + 1);
                        }}
                        disabled={page === totalPages}
                      >
                        Next
                      </button>
                    </li>
                    <li className="page-item">
                      <button
                        className={`page-link ${
                          page === totalPages
                            ? "bg-black text-white cursor-not-allowed"
                            : "bg-black text-white hover:bg-green-500 hover:text-white"
                        }`}
                        onClick={() => {
                          handlePagination(totalPages);
                        }}
                        disabled={page === totalPages}
                      >
                        Last
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </>
          )}
          {activeTab === "cart" && <Cart />}
          {activeTab === "billing" && (
            <div className="text-white">No purchase history.</div>
          )}
          {activeTab === "calculator" && <TyreAgeCalculator />}
          {activeTab === "profile" && <EditProfile />}
        </div>
      </div>
    </>
  );
};

export default Profile;



