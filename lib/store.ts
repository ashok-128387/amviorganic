import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, WishlistItem, User, Order } from './mock-data';

interface StoreState {
  // Auth
  user: User | null;
  isLoggedIn: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;

  // Wishlist
  wishlist: WishlistItem[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders
  orders: Order[];
  addOrder: (order: Order) => void;
  getOrders: () => Order[];

  // UI
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

export const useStore = create<StoreState>()(persist((set, get) => ({
  user: null,
  isLoggedIn: false,
  setUser: (user) => set({ user, isLoggedIn: user !== null }),
  logout: () => set({ user: null, isLoggedIn: false, cart: [], cartOpen: false }),

  cart: [],
  addToCart: (item) =>
    set((state) => {
      const existingItem = state.cart.find(
        (ci) => ci.productId === item.productId && ci.variationId === item.variationId
      );

      if (existingItem) {
        return {
          cart: state.cart.map((ci) =>
            ci.id === existingItem.id ? { ...ci, quantity: ci.quantity + item.quantity } : ci
          ),
        };
      }

      return { cart: [...state.cart, item] };
    }),

  removeFromCart: (itemId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== itemId),
    })),

  updateCartQuantity: (itemId, quantity) =>
    set((state) => ({
      cart: state.cart.map((item) => (item.id === itemId ? { ...item, quantity } : item)),
    })),

  clearCart: () => set({ cart: [] }),

  get cartTotal() {
    return 0; // Will be calculated in component
  },

  wishlist: [],
  addToWishlist: (productId) =>
    set((state) => {
      if (state.wishlist.some((item) => item.productId === productId)) {
        return state;
      }
      return {
        wishlist: [
          ...state.wishlist,
          {
            id: Math.random().toString(),
            productId,
            addedAt: new Date(),
          },
        ],
      };
    }),

  removeFromWishlist: (productId) =>
    set((state) => ({
      wishlist: state.wishlist.filter((item) => item.productId !== productId),
    })),

  isInWishlist: (productId) => {
    const state = get();
    return state.wishlist.some((item) => item.productId === productId);
  },

  orders: [],
  addOrder: (order) =>
    set((state) => ({
      orders: [...state.orders, order],
    })),

  getOrders: () => {
    const state = get();
    return state.orders.filter((order) => order.userId === state.user?.id);
  },

  cartOpen: false,
  setCartOpen: (open) => set({ cartOpen: open }),
}), { name: 'amvi-store', partialize: (s) => ({ user: s.user, isLoggedIn: s.isLoggedIn, cart: s.cart, wishlist: s.wishlist, orders: s.orders }) }));
