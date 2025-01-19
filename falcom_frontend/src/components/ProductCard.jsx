/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleDoubleClick = () => {
    window.open(`https://localhost:5000/products/${product.productImage}`, '_blank');
  };

  const handleViewMore = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div className='card product-card'>
      <span className='badge position-absolute top-0'>
        {product.productCategory || 'Unknown Category'}
      </span>

      <img
        src={`https://localhost:5000/products/${product.productImage}`}
        className='card-img-top'
        alt={product.productName}
        onDoubleClick={handleDoubleClick}
      />
      <div className='card-body'>
        <div className='d-flex justify-content-between pb-3'>
          <h5 className='card-title'>{product.productName}</h5>
          <p className='card-text'>NPR.{product.productPrice}</p>
        </div>
        <p className='card-description'>{product.productDescription.slice(0, 60)}</p>
        <button onClick={handleViewMore} className='btn view-more-btn'>
          View more
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
