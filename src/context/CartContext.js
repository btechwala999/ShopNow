import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const initialState = {
  cartItems: [],
  totalItems: 0,
  totalPrice: 0
};

// Helper to calculate cart totals
const calculateCartTotals = (cartItems) => {
  return cartItems.reduce(
    (totals, item) => {
      return {
        totalItems: totals.totalItems + item.quantity,
        totalPrice: totals.totalPrice + (item.price * item.quantity)
      };
    },
    { totalItems: 0, totalPrice: 0 }
  );
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItemIndex = state.cartItems.findIndex(
        item => item.id === action.payload.id
      );

      let updatedCartItems;

      if (existingItemIndex >= 0) {
        // Item already exists, update quantity
        updatedCartItems = [...state.cartItems];
        updatedCartItems[existingItemIndex] = {
          ...updatedCartItems[existingItemIndex],
          quantity: updatedCartItems[existingItemIndex].quantity + 1
        };
      } else {
        // Add new item
        const newItem = { ...action.payload, quantity: 1 };
        updatedCartItems = [...state.cartItems, newItem];
      }

      const addTotals = calculateCartTotals(updatedCartItems);
      
      return {
        ...state,
        cartItems: updatedCartItems,
        totalItems: addTotals.totalItems,
        totalPrice: addTotals.totalPrice
      };

    case 'REMOVE_FROM_CART':
      const filteredItems = state.cartItems.filter(item => item.id !== action.payload);
      const removeTotals = calculateCartTotals(filteredItems);
      
      return {
        ...state,
        cartItems: filteredItems,
        totalItems: removeTotals.totalItems,
        totalPrice: removeTotals.totalPrice
      };

    case 'UPDATE_QUANTITY':
      const { id, quantity } = action.payload;
      
      if (quantity <= 0) {
        return state;
      }
      
      const itemToUpdateIndex = state.cartItems.findIndex(item => item.id === id);
      
      if (itemToUpdateIndex === -1) {
        return state;
      }
      
      const updatedItems = [...state.cartItems];
      updatedItems[itemToUpdateIndex] = {
        ...updatedItems[itemToUpdateIndex],
        quantity: quantity
      };
      
      const updateTotals = calculateCartTotals(updatedItems);
      
      return {
        ...state,
        cartItems: updatedItems,
        totalItems: updateTotals.totalItems,
        totalPrice: updateTotals.totalPrice
      };

    case 'CLEAR_CART':
      return initialState;
      
    case 'REPLACE_CART':
      return {
        ...action.payload
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        Object.keys(initialState).forEach(key => {
          if (!(key in parsedCart)) {
            parsedCart[key] = initialState[key];
          }
        });
        dispatch({ type: 'REPLACE_CART', payload: parsedCart });
      } catch (error) {
        console.error('Error parsing cart from localStorage', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { id: productId, quantity: parseInt(quantity) }
    });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 