// src/services/productService.ts
import api from './api';
import { Product } from '../types';

// Obter todos os produtos
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    throw error;
  }
};

// Obter produto por ID
export const getProductById = async (id: number): Promise<Product> => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar produto ${id}:`, error);
    throw error;
  }
};

// Criar novo produto
export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  try {
    const response = await api.post('/products', product);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    throw error;
  }
};

// Atualizar produto existente
export const updateProduct = async (id: number, product: Omit<Product, 'id'>): Promise<Product> => {
  try {
    const response = await api.put(`/products/${id}`, product);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar produto ${id}:`, error);
    throw error;
  }
};

// Atualizar apenas a imagem do produto
export const updateProductImage = async (id: number, imageUrl: string): Promise<Product> => {
  try {
    const response = await api.put(`/products/${id}/image`, { pictureUrl: imageUrl });
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar imagem do produto ${id}:`, error);
    throw error;
  }
};

// Excluir produto
export const deleteProduct = async (id: number): Promise<void> => {
  try {
    await api.delete(`/products/${id}`);
  } catch (error) {
    console.error(`Erro ao excluir produto ${id}:`, error);
    throw error;
  }
};