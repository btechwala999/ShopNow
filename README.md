# ShopNow - React E-commerce Project

## Overview

ShopNow is a modern, responsive e-commerce web application built with React. It features a clean, intuitive user interface with smooth animations and a seamless shopping experience. The application integrates with the Fake Store API to provide realistic product data.

## Features

- **User Authentication**
  - Secure login and registration system
  - User data stored in local storage
  - Protected routes requiring authentication

- **Product Browsing**
  - Browse all products or filter by category
  - Search functionality to find specific products
  - Responsive product grid with beautiful card animations

- **Product Details**
  - Detailed product view with high-quality images
  - Complete product descriptions and pricing information
  - Easy add-to-cart functionality

- **Shopping Cart**
  - Add/remove products from cart
  - Adjust product quantities
  - Real-time cart total calculation
  - Persistent cart using local storage

- **Checkout Process**
  - Simple checkout flow
  - Order confirmation

- **UI/UX Features**
  - Modern, clean design with attractive animations
  - Fully responsive layout that works on all devices
  - Loading states with animated indicators
  - Glassmorphism effect throughout the interface
  - Custom scrollbar for enhanced user experience

## Technical Details

### Built With
- React.js
- React Router for navigation
- Context API for state management
- CSS for styling (no external UI libraries)
- Fake Store API for product data

### Project Structure
```
ecommerce-shop/
├── public/
└── src/
    ├── components/
    │   ├── auth/          # Authentication components (Login, SignUp)
    │   ├── cart/          # Cart related components
    │   ├── layout/        # Layout components (Header, LoadingScreen)
    │   └── products/      # Product related components
    ├── context/           # React Context providers
    ├── services/          # API service for data fetching
    ├── App.js             # Main application component
    ├── App.css            # Global styles
    └── index.js           # Entry point
```

## Getting Started

### Prerequisites
- Node.js (v14.0 or later recommended)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/ecommerce-shop.git
   cd ecommerce-shop
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Demo Account
You can use the following credentials to test the application:
- Username: `johnd`
- Password: `m38rmF$`

Or you can register a new account using the sign-up page.

## Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones

## Performance Optimizations

- Optimized images and assets
- Minimal re-renders using React's Context API
- Lazy loading of components
- Debounced search input
- Efficient state management

## Future Enhancements

- User profile management
- Order history
- Wishlist functionality
- Product reviews and ratings
- Payment gateway integration
- Admin dashboard

## License

This project is available for personal and educational use.

## Acknowledgements

- [Fake Store API](https://fakestoreapi.com/) for providing product data
- [React](https://reactjs.org/) team for the amazing library
- [React Router](https://reactrouter.com/) for routing capabilities
