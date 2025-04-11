import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import LoadingScreen from '../layout/LoadingScreen';
import './Cart.css';

const Cart = () => {
  const { cartItems, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleQuantityChange = (productId, event) => {
    const newQuantity = parseInt(event.target.value);
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemove = (productId) => {
    removeFromCart(productId);
  };

  const handleCheckout = () => {
    setLoading(true);
    
    // Simulate a checkout process
    setTimeout(() => {
      setLoading(false);
      setCheckoutSuccess(true);
      
      // Clear cart after 4 seconds
      setTimeout(() => {
        clearCart();
        setCheckoutSuccess(false);
      }, 4000);
    }, 2000);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (checkoutSuccess) {
    return (
      <div className="checkout-success">
        <div className="success-message">
          <h2>Order placed successfully!</h2>
          <p>Thank you for your purchase.</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your cart is empty</h2>
        <p>Add some products to your cart and they will show up here.</p>
        <Link to="/" className="continue-shopping-btn">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      <div className="cart-summary">
        <p>{totalItems} item{totalItems !== 1 ? 's' : ''} in cart</p>
      </div>
      
      <div className="cart-items">
        {cartItems.map(item => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-image">
              <img src={item.image} alt={item.title} />
            </div>
            
            <div className="cart-item-details">
              <h3 className="cart-item-title">
                <Link to={`/product/${item.id}`}>{item.title}</Link>
              </h3>
              <div className="cart-item-price">${item.price.toFixed(2)}</div>
            </div>
            
            <div className="cart-item-controls">
              <div className="quantity-control">
                <label htmlFor={`quantity-${item.id}`}>Qty:</label>
                <input
                  id={`quantity-${item.id}`}
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, e)}
                />
              </div>
              
              <button 
                className="remove-item-btn"
                onClick={() => handleRemove(item.id)}
              >
                Remove
              </button>
            </div>
            
            <div className="cart-item-subtotal">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      
      <div className="cart-footer">
        <div className="cart-total">
          <h3>Total</h3>
          <span className="total-price">${totalPrice.toFixed(2)}</span>
        </div>
        
        <div className="cart-actions">
          <Link to="/" className="continue-shopping-btn">
            Continue Shopping
          </Link>
          
          <button 
            className="checkout-btn"
            onClick={handleCheckout}
            disabled={loading}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart; 