// src/context/ProductContext.tsx
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { useRouteLoaderData, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { getToken } from '../services/authService';
import { LoaderData } from '../loaders/productLoader';
import { 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../services/productService';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: number, product: Omit<Product, 'id'>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Usa useRouteLoaderData para acessar dados da rota raiz
  const { products: initialProducts } = useRouteLoaderData("root") as LoaderData;
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Adicionar produto
  const addProductHandler = useCallback(async (productData: Omit<Product, 'id'>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Garantir que temos um token
      const token = getToken();
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }
      
      const newProduct = await createProduct(productData);
      setProducts(prevProducts => [...prevProducts, newProduct]);
      navigate('/');
    } catch (err) {
      setError('Erro ao adicionar produto. Por favor, tente novamente.');
      console.error('Erro ao adicionar produto:', err);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // Atualizar produto
  const updateProductHandler = useCallback(async (id: number, productData: Omit<Product, 'id'>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedProduct = await updateProduct(id, productData);
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === id ? updatedProduct : product
        )
      );
    } catch (err) {
      setError('Erro ao atualizar produto. Por favor, tente novamente.');
      console.error('Erro ao atualizar produto:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Excluir produto
  const deleteProductHandler = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await deleteProduct(id);
      setProducts(prevProducts => 
        prevProducts.filter(product => product.id !== id)
      );
    } catch (err) {
      setError('Erro ao excluir produto. Por favor, tente novamente.');
      console.error('Erro ao excluir produto:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <ProductContext.Provider 
      value={{ 
        products, 
        addProduct: addProductHandler, 
        updateProduct: updateProductHandler,
        deleteProduct: deleteProductHandler,
        isLoading,
        error
      }}
    >
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