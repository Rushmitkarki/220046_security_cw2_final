import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getSingleProductApi, updateProductApi } from "../../../apis/Api";

const UpdateProduct = () => {
  const { id } = useParams("id");
  const navigate = useNavigate();

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [productImage, setProductImage] = useState(null);

  const [oldImage, setOldImage] = useState(null);
  const [previewNewImage, setPreviewNewImage] = useState(null);

  useEffect(() => {
    getSingleProductApi(id)
      .then((res) => {
        setProductName(res.data.product.productName);
        setProductDescription(res.data.product.productDescription);
        setProductPrice(res.data.product.productPrice);
        setProductCategory(res.data.product.productCategory);
        setProductQuantity(res.data.product.productQuantity);
        setOldImage(res.data.product.productImage);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProductImage(file);
    setPreviewNewImage(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("productDescription", productDescription);
    formData.append("productPrice", productPrice);
    formData.append("productCategory", productCategory);
    formData.append("productQuantity", productQuantity);
    if (productImage) {
      formData.append("productImage", productImage);
    }

    updateProductApi(id, formData)
      .then((res) => {
        if (res.status === 201) {
          toast.success(res.data.message);
        }
      })
      .catch((err) => {
        if (err.response.status === 500) {
          toast.error(err.response.data.message);
        } else if (err.response.status === 400) {
          toast.error(err.response.data.message);
        } else {
          toast.error("Something went wrong");
        }
      });
  };

  return (
    <div className="container mx-auto p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          Update Product: {productName}
        </h2>
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="bg-neutral-500 hover:bg-rose-900 text-white font-bold py-2 px-4 rounded"
        >
          Back to Dashboard
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-200 p-6 rounded shadow-md"
        >
          <div className="mb-4">
            <label
              htmlFor="productName"
              className="block text-gray-700 font-bold mb-2"
            >
              Product Name
            </label>
            <input
              id="productName"
              type="text"
              className="form-input mt-1 block w-full h-10 rounded"
              placeholder="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="productDescription"
              className="block text-gray-700 font-bold mb-2"
            >
              Product Description
            </label>
            <textarea
              id="productDescription"
              className="form-textarea mt-1 block w-full h-24 rounded"
              placeholder="Product Description"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="mb-4">
            <label
              htmlFor="productQuantity"
              className="block text-gray-700 font-bold mb-2"
            >
              Product Quantity
            </label>
            <input
              id="productQuantity"
              type="text"
              className="form-input mt-1 block w-full h-10 rounded"
              placeholder="Product Quantity"
              value={productQuantity}
              onChange={(e) => setProductQuantity(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="productPrice"
              className="block text-gray-700 font-bold mb-2"
            >
              Product Price
            </label>
            <input
              id="productPrice"
              type="text"
              className="form-input mt-1 block w-full h-10 rounded"
              placeholder="Product Price"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="productCategory"
              className="block text-gray-700 font-bold mb-2"
            >
              Product Category
            </label>
            <select
              id="productCategory"
              className="form-select mt-1 block w-full h-10 rounded"
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              <option value="Tyre Radial Tubeless">Tyre Radial Tubeless</option>
              <option value="Tyre with Tube Nylon">Tyre with Tube Nylon</option>
              <option value="Tube">Tube</option>
              <option value="Lubricants">Lubricants</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="productImage"
              className="block text-gray-700 font-bold mb-2"
            >
              Product Image
            </label>
            <input
              id="productImage"
              type="file"
              className="form-input mt-1 block w-full rounded"
              onChange={handleImageChange}
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            Update Product
          </button>
        </form>
        <div className="flex justify-center items-center">
          {!previewNewImage ? (
            <img
              src={`https://localhost:5000/products/${oldImage}`}
              className="w-full h-auto rounded shadow-md"
              alt="product"
            />
          ) : (
            <img
              src={previewNewImage}
              className="w-full h-auto rounded shadow-md"
              alt="product"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;
