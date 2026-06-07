import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, mockProducts } from './mock-data';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdminProduct extends Product {}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  published: boolean;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percent' | 'flat';
  value: number;
  minOrder: number;
  maxUses: number;
  usedCount: number;
  active: boolean;
  expiresAt: string;
}

export interface AdminOrder {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: { name: string; qty: number; price: number }[];
  shippingAddress?: string;
  trackingId?: string;
  createdAt: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  email: string;
  rating: number;
  title: string;
  comment: string;
  approved: boolean;
  createdAt: string;
}

export interface OtpEntry {
  email: string;
  otp: string;
  expiresAt: number;
}

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  registeredAt: string;
}

export interface SiteSettings {
  storeName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  instagramUrl: string;
  facebookUrl: string;
  whatsappNumber: string;
  freeShippingThreshold: number;
  shippingCharge: number;
  taxPercent: number;
}

// ─── Store ────────────────────────────────────────────────────────────────────

interface AdminState {
  // Auth
  adminLoggedIn: boolean;
  adminLogin: (password: string) => boolean;
  adminLogout: () => void;

  // Products
  products: AdminProduct[];
  addProduct: (p: AdminProduct) => void;
  updateProduct: (id: string, p: Partial<AdminProduct>) => void;
  deleteProduct: (id: string) => void;

  // Blogs
  blogs: BlogPost[];
  addBlog: (b: BlogPost) => void;
  updateBlog: (id: string, b: Partial<BlogPost>) => void;
  deleteBlog: (id: string) => void;

  // Coupons
  coupons: Coupon[];
  addCoupon: (c: Coupon) => void;
  updateCoupon: (id: string, c: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  validateCoupon: (code: string, orderTotal: number) => { valid: boolean; discount: number; message: string };

  // Orders
  orders: AdminOrder[];
  addAdminOrder: (o: AdminOrder) => void;
  updateOrderStatus: (id: string, status: AdminOrder['status']) => void;
  updateOrderTracking: (id: string, trackingId: string) => void;

  // Reviews
  reviews: ProductReview[];
  addReview: (r: ProductReview) => void;
  updateReview: (id: string, r: Partial<ProductReview>) => void;
  approveReview: (id: string) => void;
  deleteReview: (id: string) => void;

  // Users
  users: RegisteredUser[];
  addRegisteredUser: (u: RegisteredUser) => void;
  deleteRegisteredUser: (id: string) => void;

  // Site Settings
  siteSettings: SiteSettings;
  updateSiteSettings: (s: Partial<SiteSettings>) => void;

  // OTP
  otpStore: OtpEntry[];
  generateOtp: (email: string) => string;
  verifyOtp: (email: string, otp: string) => boolean;
}

const ADMIN_PASSWORD = 'amvi@admin2024';

const DEFAULT_SETTINGS: SiteSettings = {
  storeName: 'AMVI Organics',
  contactEmail: 'contact@amviorganics.com',
  contactPhone: '+91-8748899100',
  address: 'Mandya, Karnataka, India',
  instagramUrl: 'https://instagram.com/amviorganics',
  facebookUrl: 'https://facebook.com/amviorganics',
  whatsappNumber: '918748899100',
  freeShippingThreshold: 500,
  shippingCharge: 50,
  taxPercent: 5,
};

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      // ── Products ──
      products: mockProducts,
      addProduct: (p) => set((s) => ({ products: [...s.products, p] })),
      updateProduct: (id, p) =>
        set((s) => ({ products: s.products.map((x) => (x.id === id ? { ...x, ...p } : x)) })),
      deleteProduct: (id) =>
        set((s) => ({ products: s.products.filter((x) => x.id !== id) })),

      // ── Blogs ──
      blogs: [],
      addBlog: (b) => set((s) => ({ blogs: [...s.blogs, b] })),
      updateBlog: (id, b) =>
        set((s) => ({ blogs: s.blogs.map((x) => (x.id === id ? { ...x, ...b } : x)) })),
      deleteBlog: (id) =>
        set((s) => ({ blogs: s.blogs.filter((x) => x.id !== id) })),

      // ── Coupons ──
      coupons: [],
      addCoupon: (c) => set((s) => ({ coupons: [...s.coupons, c] })),
      updateCoupon: (id, c) =>
        set((s) => ({ coupons: s.coupons.map((x) => (x.id === id ? { ...x, ...c } : x)) })),
      deleteCoupon: (id) =>
        set((s) => ({ coupons: s.coupons.filter((x) => x.id !== id) })),
      validateCoupon: (code, orderTotal) => {
        const { coupons } = get();
        const coupon = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase());
        if (!coupon) return { valid: false, discount: 0, message: 'Invalid coupon code' };
        if (!coupon.active) return { valid: false, discount: 0, message: 'Coupon is inactive' };
        if (new Date(coupon.expiresAt) < new Date()) return { valid: false, discount: 0, message: 'Coupon has expired' };
        if (coupon.usedCount >= coupon.maxUses) return { valid: false, discount: 0, message: 'Coupon usage limit reached' };
        if (orderTotal < coupon.minOrder) return { valid: false, discount: 0, message: `Minimum order ₹${coupon.minOrder} required` };
        const discount = coupon.type === 'percent' ? Math.round((orderTotal * coupon.value) / 100) : coupon.value;
        return { valid: true, discount, message: `Coupon applied! You save ₹${discount}` };
      },

      // ── Orders ──
      orders: [
        {
          id: 'ORD-001', customerName: 'Priya Sharma', email: 'priya@example.com',
          phone: '9876543210', total: 780, status: 'delivered',
          items: [{ name: 'Jaggery Cubes 1KG', qty: 1, price: 780 }],
          shippingAddress: '12 MG Road, Bangalore, Karnataka 560001',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'ORD-002', customerName: 'Rajesh Kumar', email: 'rajesh@example.com',
          phone: '9123456789', total: 899, status: 'shipped',
          items: [{ name: 'Combo Pack', qty: 1, price: 899 }],
          shippingAddress: '45 Anna Nagar, Chennai, Tamil Nadu 600040',
          trackingId: 'DTDC123456789',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'ORD-003', customerName: 'Meera Patel', email: 'meera@example.com',
          phone: '9988776655', total: 549, status: 'processing',
          items: [{ name: 'Liquid Jaggery + Powder Combo', qty: 1, price: 549 }],
          shippingAddress: '7 Bandra West, Mumbai, Maharashtra 400050',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
      addAdminOrder: (o) => set((s) => ({ orders: [o, ...s.orders] })),
      updateOrderStatus: (id, status) =>
        set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)) })),
      updateOrderTracking: (id, trackingId) =>
        set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, trackingId } : o)) })),

      // ── Reviews ──
      reviews: [
        {
          id: 'rev1', productId: '1', productName: 'Jaggery Cubes',
          customerName: 'Priya Sharma', email: 'priya@example.com',
          rating: 5, title: 'Pure and authentic',
          comment: 'Best jaggery cubes I have tasted. Pure and chemical-free.',
          approved: true, createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'rev2', productId: '2', productName: 'Masala Jaggery Cubes',
          customerName: 'Rajesh Kumar', email: 'rajesh@example.com',
          rating: 4, title: 'Great masala blend',
          comment: 'Love the spice mix. Would have given 5 stars but packaging could be better.',
          approved: false, createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
      addReview: (r) => set((s) => ({ reviews: [...s.reviews, r] })),
      updateReview: (id, r) =>
        set((s) => ({ reviews: s.reviews.map((x) => (x.id === id ? { ...x, ...r } : x)) })),
      approveReview: (id) =>
        set((s) => ({ reviews: s.reviews.map((r) => (r.id === id ? { ...r, approved: !r.approved } : r)) })),
      deleteReview: (id) =>
        set((s) => ({ reviews: s.reviews.filter((r) => r.id !== id) })),

      // ── Users ──
      users: [],
      addRegisteredUser: (u) =>
        set((s) => ({
          users: s.users.some((x) => x.email === u.email) ? s.users : [...s.users, u],
        })),
      deleteRegisteredUser: (id) =>
        set((s) => ({ users: s.users.filter((u) => u.id !== id) })),

      // ── Site Settings ──
      siteSettings: DEFAULT_SETTINGS,
      updateSiteSettings: (s) =>
        set((state) => ({ siteSettings: { ...state.siteSettings, ...s } })),

      // ── OTP ──
      otpStore: [],
      generateOtp: (email) => {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 10 * 60 * 1000;
        set((s) => ({
          otpStore: [...s.otpStore.filter((o) => o.email !== email), { email, otp, expiresAt }],
        }));
        return otp;
      },
      verifyOtp: (email, otp) => {
        const { otpStore } = get();
        const entry = otpStore.find((o) => o.email === email);
        if (!entry || Date.now() > entry.expiresAt || entry.otp !== otp) return false;
        set((s) => ({ otpStore: s.otpStore.filter((o) => o.email !== email) }));
        return true;
      },
    }),
    {
      name: 'amvi-admin-store-v2',
      partialize: (state) => ({
        adminLoggedIn: state.adminLoggedIn,
        orders: state.orders,
        reviews: state.reviews,
        users: state.users,
        siteSettings: state.siteSettings,
        otpStore: state.otpStore,
      }),
    }
  )
);
