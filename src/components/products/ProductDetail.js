import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { getProductById } from '../../services/api';
import LoadingScreen from '../layout/LoadingScreen';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const productData = await getProductById(id);
        
        // Simulate minimum loading time of 2 seconds
        setTimeout(() => {
          setProduct(productData);
          setLoading(false);
        }, 2000);
      } catch (error) {
        setError('Failed to fetch product. Please try again later.');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    setAddingToCart(true);
    
    // Simulate loading time when adding to cart
    setTimeout(() => {
      addToCart(product);
      setAddingToCart(false);
    }, 2000);
  };

  if (loading || addingToCart) {
    return <LoadingScreen />;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!product) {
    return <div className="error">Product not found.</div>;
  }

  return (
    <div className="product-detail-container">
      <div className="product-detail-card">
        <div className="product-detail-image">
          <img src={product.image} alt={product.title} />
        </div>
        
        <div className="product-detail-info">
          <h1 className="product-detail-title">{product.title}</h1>
          
          <div className="product-detail-category">
            {product.category}
          </div>
          
          <div className="product-detail-price">
            ${product.price.toFixed(2)}
          </div>
          
          <div className="product-detail-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>
          
          <div className="product-detail-actions">
            <button 
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={addingToCart}
            >
              Add to Cart
            </button>
            
            <Link to="/" className="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 