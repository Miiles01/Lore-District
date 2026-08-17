import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'loredistrict_cart';

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addItem(product, quantity = 1, options = {}, computedPrice = 0) {
    setItems((prev) => {
      // Create a unique hash for the product + options combination
      const optionsHash = JSON.stringify(options);
      const existing = prev.find((i) => i.product_id === product.id && i.optionsHash === optionsHash);
      if (existing) {
        return prev.map((i) =>
          (i.product_id === product.id && i.optionsHash === optionsHash) ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        {
          product_id: product.id,
          name: product.name,
          image_url: product.image_url,
          price: computedPrice,
          quantity,
          options,
          optionsHash,
          cartItemId: Math.random().toString(36).substr(2, 9), // unique ID for UI
        },
      ];
    });
    setDrawerOpen(true);
  }

  function updateQuantity(cartItemId, quantity) {
    if (quantity <= 0) {
      removeItem(cartItemId);
      return;
    }
    setItems((prev) => prev.map((i) => (i.cartItemId === cartItemId ? { ...i, quantity } : i)));
  }

  function removeItem(cartItemId) {
    setItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  }

  function clearCart() {
    setItems([]);
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        subtotal,
        count,
        drawerOpen,
        setDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
