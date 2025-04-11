import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProducts, getProductsByCategory, getCategories } from '../../services/api';
import LoadingScreen from '../layout/LoadingScreen';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { category } = useParams();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let productsData;
        
        if (category) {
          productsData = await getProductsByCategory(category);
        } else {
          productsData = await getProducts();
        }
        
        // Simulate minimum loading time of 2 seconds
        setTimeout(() => {
          setProducts(productsData);
          setLoading(false);
        }, 2000);
      } catch (error) {
        setError('Failed to fetch products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="product-list-container">
      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="categories">
          <h3>Categories</h3>
          <ul>
            <li className={!category ? 'active' : ''}>
              <Link to="/">All Products</Link>
            </li>
            {categories.map(cat => (
              <li key={cat} className={category === cat ? 'active' : ''}>
                <Link to={`/products/category/${cat}`}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="products-grid">
        {filteredProducts.length === 0 ? (
          <div className="no-products">No products found</div>
        ) : (
          filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.title} />
              </div>
              <div className="product-details">
                <h3 className="product-title">{product.title}</h3>
                <p className="product-price">${product.price.toFixed(2)}</p>
                <div className="product-category">{product.category}</div>
                <Link to={`/product/${product.id}`} className="view-product-btn">
                  View Details
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductList; 