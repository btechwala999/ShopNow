import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import LoadingScreen from './LoadingScreen';
import './Header.css';

const Header = () => {
  const { isAuthenticated, logout, user, loading } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close menu when navigating
  useEffect(() => {
    setMenuOpen(false);
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const isLoggedIn = isAuthenticated();
  
  // Format username to limit length
  const formatUsername = (username) => {
    if (!username) return '';
    return username.length > 12 ? username.substring(0, 10) + '...' : username;
  };

  return (
    <>
      {loading && <LoadingScreen />}
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <Link to={isLoggedIn ? "/" : "/login"} className="logo">
            ShopNow
          </Link>

          <div className={`hamburger ${menuOpen ? 'active' : ''}`} onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>

          <nav className={`nav ${menuOpen ? 'active' : ''}`}>
            <ul className="nav-list">
              {isLoggedIn ? (
                <>
                  <li className="nav-item">
                    <Link to="/" className="nav-link">Home</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/cart" className="nav-link cart-link">
                      Cart
                      {totalItems > 0 && (
                        <span className="cart-count">{totalItems}</span>
                      )}
                    </Link>
                  </li>
                  {user && (
                    <li className="nav-item user-name">
                      <span>Hello, {formatUsername(user.username)}</span>
                    </li>
                  )}
                  <li className="nav-item">
                    <button onClick={handleLogout} className="nav-link logout-btn" disabled={loading}>
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link to="/login" className="nav-link">Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/signup" className="nav-link">Sign Up</Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header; 