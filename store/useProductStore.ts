import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../types/product';

interface ProductStore {
  products: Product[];
  loading: boolean;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  loadProducts: () => Promise<void>;
  searchProducts: (query: string) => Product[];
}

const STORAGE_KEY = '@products';

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  loading: true,

  addProduct: async (productData) => {
    const product: Product = {
      ...productData,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const products = [...get().products, product];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    set({ products });
  },

  updateProduct: async (updatedProduct) => {
    const products = get().products.map(product =>
      product.id === updatedProduct.id
        ? { ...updatedProduct, updatedAt: new Date().toISOString() }
        : product
    );
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    set({ products });
  },

  deleteProduct: async (id) => {
    const products = get().products.filter(product => product.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    set({ products });
  },

  loadProducts: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      const products = data ? JSON.parse(data) : [];
      set({ products, loading: false });
    } catch (error) {
      console.error('Error loading products:', error);
      set({ loading: false });
    }
  },

  searchProducts: (query) => {
    const products = get().products;
    if (!query) return products;

    const lowercaseQuery = query.toLowerCase();
    return products.filter(product =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.sku.toLowerCase().includes(lowercaseQuery)
    );
  },
}));