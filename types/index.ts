// Database configuration type
export interface ServerConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  port: number;
}

// Store type
export interface Store {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Category type
export interface Category {
  id: string;
  storeId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// Size type
export interface Size {
  id: string;
  storeId: string;
  name: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
}

// Color type
export interface Color {
  id: string;
  storeId: string;
  name: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
}

// For API responses where only color name/value is needed
export interface ProductColorLite {
  name: string;
  value: string;
}

// Supplier type
export interface Supplier {
  id: string;
  storeId: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Product type
export interface Product {
  id: string;
  storeId: string;
  categoryId: string;
  name: string;
  slug?: string;
  sku?: string;
  barcode?: string;
  description?: string;
  price: number;
  comparePrice?: number;
  cost?: number;
  stock: number;
  weight?: number;
  material?: string;
  countryOfOrigin?: string;
  isFeatured: boolean;
  isArchived: boolean;
  freeShipping: boolean;
  isConfigurable: boolean;
  taxClass: 'standard' | 'reduced' | 'exempt';
  status: 'draft' | 'published' | 'out_of_stock';
  publishedAt: Date;
  expiresAt?: Date;
  sizeId?: string;
  colorId?: string;
  colorName?: string;
  colorValue?: string;
  supplierId?: string;
  views: number;
  sales: number;
  videoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations (optional)
  category?: Category;
  size?: Size;
  color?: Color | ProductColorLite;
  supplier?: Supplier;
  images?: Image[];
}

// Image type
export interface Image {
  id: string;
  productId: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

// Order type
export interface Order {
  id: string;
  storeId: string;
  isPaid: boolean;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations (optional)
  items?: OrderItem[];
}

// OrderItem type
export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  
  // Relations (optional)
  product?: Product;
}

// Dashboard statistics
export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalSuppliers: number;
  recentOrders: Order[];
  topProducts: Product[];
  productCategoryData: { name: string; value: number }[];
  monthlySalesData: { name: string; sales: number }[];
}

// API response type
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
