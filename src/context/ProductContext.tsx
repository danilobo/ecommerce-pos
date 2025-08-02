// src/context/ProductContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useRouteLoaderData, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { LoaderData } from '../loaders/productLoader';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  getNextId: () => number;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Usa useRouteLoaderData para acessar dados da rota raiz
  const { products: initialProducts } = useRouteLoaderData("root") as LoaderData;
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const navigate = useNavigate();

  const getNextId = (): number => {
    return Math.max(0, ...products.map(p => p.id)) + 1;
  };

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: getNextId()
    };
    setProducts(prevProducts => [...prevProducts, newProduct]);
    navigate('/');
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, getNextId }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};