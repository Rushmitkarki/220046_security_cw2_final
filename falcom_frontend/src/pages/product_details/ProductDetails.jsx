import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getSingleProductApi,
  getRecommendedProductsApi,
  addToCartApi,
  getReviewsApi,
  getReviewsByProductAndUserApi,
  getAverageRatingApi,
  addReviewApi,
} from "../../apis/Api";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";
import ProductCard from "../../components/ProductCard";
import { FaShoppingCart, FaDollarSign } from "react-icons/fa";
import { Star } from "lucide-react";
import DOMPurify from "dompurify"; // For sanitizing HTML
import validator from "validator"; // For sanitizing inputs

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [quantity, setQuantity] = useState(1); // Default quantity set to 1
  const [totalPrice, setTotalPrice] = useState(0);
  const [isOutStock, setIsOutStock] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewChange, setReviewChange] = useState(false);
  const [ownReview, setOwnReview] = useState(null);
  const [productsRatings, setProductsRatings] = useState({});
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    getSingleProductApi(id)
      .then((res) => {
        setProduct(res.data.product);
        setTotalPrice(res.data.product.productPrice);
        return res.data.product.productCategory;
      })
      .then((category) => {
        return getRecommendedProductsApi(category);
      })
      .then((res) => {
        setRecommendedProducts(res.data.products);
      })
      .catch((err) => {
        setError(err.response.data.message);
      });
  }, [id]);

  useEffect(() => {
    getReviewsApi(id)
      .then((res) => {
        if (res.status === 200) {
          setReviews(res.data.reviews);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id, reviewChange]);

  useEffect(() => {
    getReviewsByProductAndUserApi(id)
      .then((res) => {
        if (res.status === 200) {
          setOwnReview(res.data.review);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id, reviewChange]);

  useEffect(() => {
    getAverageRatingApi(id)
      .then((res) => {
        if (res.status === 200) {
          const ratings = res.data.averageRating;
          const id = res.data.productId;
          setProductsRatings((prev) => ({ ...prev, [id]: ratings }));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id, reviewChange]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    const data = {
      productId: product._id,
      quantity: quantity,
    };
    addToCartApi(data)
      .then((res) => {
        updateStockStatus(product, quantity);
        toast.success(res.data.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSearch = () => {
    if (searchQuery) {
      navigate(`/profile?search=${searchQuery}`);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const updateStockStatus = (product, quantity) => {
    if (product.productQuantity < quantity) {
      setIsOutStock(true);
      toast.error("Out of Stock");
    } else {
      setIsOutStock(false);
      setError("");
    }
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();

    // Sanitize inputs
    const sanitizedReview = DOMPurify.sanitize(review);
    const sanitizedRating = validator.escape(rating.toString());

    if (!sanitizedRating || !sanitizedReview) {
      toast.error("Please ensure all fields are filled correctly.");
      return;
    }

    addReviewApi({
      productId: product._id,
      rating: sanitizedRating,
      review: sanitizedReview,
    })
      .then((response) => {
        if (response.status === 201) {
          toast.success(response.data.message);
          setShowReviewForm(false);
          setReviewChange(!reviewChange);
        } else {
          return Promise.reject(
            response.data.message || "Unexpected error occurred"
          );
        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 400) {
            toast.error(error.response.data.message);
          } else {
            toast.error("Error Occurred");
          }
        }
      });
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-8 bg-gray-900 text-white">
      {/* Search and navigation */}
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center w-full max-w-2xl">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(validator.escape(e.target.value))} // Sanitize search query
            onKeyPress={handleKeyPress}
            className="w-full px-6 py-3 bg-gray-800 border border-gray-700 rounded-l-full focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Search for products..."
          />
          <button
            onClick={handleSearch}
            className="bg-red-600 text-white font-bold py-3 px-8 rounded-r-full hover:bg-red-700 transition duration-300"
          >
            Search
          </button>
        </div>
        <button
          className="bg-gray-800 text-white font-bold py-3 px-8 rounded-full hover:bg-gray-700 transition duration-300"
          onClick={() => navigate("/profile")}
        >
          Back to Dashboard
        </button>
      </div>

      {/* Product details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left section with images */}
        <div className="space-y-6">
          <img
            src={`https://localhost:5000/products/${product.productImage}`}
            alt={product.productName}
            className="w-full h-auto rounded-lg shadow-lg"
          />
          <div className="flex justify-center space-x-4">
            {[
              product.productImage,
              product.productImage,
              product.productImage,
            ].map((image, index) => (
              <img
                key={index}
                src={`https://localhost:5000/products/${image}`}
                alt={`${product.productName} thumbnail ${index}`}
                className="w-24 h-24 object-cover rounded-lg border border-gray-700 cursor-pointer hover:border-red-500 transition duration-300"
              />
            ))}
          </div>
        </div>

        {/* Right section with product details */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold">
            {DOMPurify.sanitize(product.productName)}
          </h1>
          <p className="text-xl text-gray-400">Trademark Fine Art</p>
          <p className="text-3xl font-bold text-red-500">NPR. {totalPrice}</p>

          <div className="flex items-center space-x-2">
            <span className="font-semibold">Average Rating:</span>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 ${
                    star <= productsRatings[product._id]
                      ? "text-yellow-400 fill-current"
                      : "text-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>

          <div>
            <span className="font-semibold">Available Quantity:</span>{" "}
            <span>{product.productQuantity}</span>
          </div>

          <form onSubmit={handleAddToCart} className="space-y-6">
            <div>
              <label
                htmlFor="quantity"
                className="block text-sm font-medium mb-2"
              >
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={quantity}
                onChange={(e) => {
                  const newQuantity = Math.max(1, parseInt(e.target.value)); // Ensure quantity is at least 1
                  setQuantity(newQuantity);
                  updateStockStatus(product, newQuantity);
                }}
                min="1"
                max={product.productQuantity}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <button
              className="w-full bg-red-600 text-white font-bold py-3 px-6 rounded-full hover:bg-red-700 transition duration-300 flex items-center justify-center"
              type="submit"
            >
              <FaShoppingCart className="mr-2" /> Add to Cart
            </button>
          </form>

          <button
            className="w-full bg-gray-800 text-white font-bold py-3 px-6 rounded-full hover:bg-gray-700 transition duration-300 flex items-center justify-center"
            onClick={() => console.log("Buy Now clicked")}
          >
            <FaDollarSign className="mr-2" /> Buy Now
          </button>

          <div>
            <span className="font-semibold">Category:</span>{" "}
            <span>{DOMPurify.sanitize(product.productCategory)}</span>
          </div>

          <div>
            <span className="font-semibold">Description:</span>{" "}
            <p className="mt-2 text-gray-300">
              {DOMPurify.sanitize(product.productDescription)}
            </p>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="mt-16 bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        {reviews && reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div
              key={index}
              className="mb-6 pb-6 border-b border-gray-700 last:border-b-0"
            >
              <div className="flex items-center mb-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-400">
                  {review.date}
                </span>
              </div>
              <p className="text-gray-300">
                {DOMPurify.sanitize(review.review)}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No reviews yet</p>
        )}
        <button
          onClick={() => {
            setShowReviewForm(true);
            if (ownReview) {
              setRating(ownReview.rating);
              setReview(ownReview.review);
            }
          }}
          className="mt-6 bg-red-600 text-white px-6 py-2 rounded-md font-bold hover:bg-red-700 transition-colors duration-200"
        >
          {ownReview ? "Update Review" : "Write a Review"}
        </button>

        {showReviewForm && (
          <form
            onSubmit={handleReviewSubmit}
            className="mt-6 bg-gray-700 p-6 rounded-lg"
          >
            <h3 className="text-xl font-semibold mb-4">
              {ownReview ? "Update Your Review" : "Write Your Review"}
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Rating
              </label>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-8 h-8 cursor-pointer ${
                      star <= rating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-500"
                    }`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="review"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Your Review
              </label>
              <textarea
                id="review"
                rows="4"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="w-full px-3 py-2 text-gray-300 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500"
                placeholder="Write your review here..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 text-white px-6 py-3 rounded-md font-bold hover:bg-red-700 transition-colors duration-200"
            >
              Submit Review
            </button>
          </form>
        )}
      </div>

      {/* Recommended Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8 text-white">
          Recommended Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {recommendedProducts.map((recommendedProduct) => (
            <ProductCard
              key={recommendedProduct._id}
              product={recommendedProduct}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
