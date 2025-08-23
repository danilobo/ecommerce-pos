// src/services/productService.ts
import api from './api';
import { Product } from '../types';
import axios from 'axios';

// Obter todos os produtos
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get('/api/product');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    throw error;
  }
};

// Obter produto por ID
export const getProductById = async (id: string): Promise<Product> => {
  try {
    const response = await api.get(`/api/product/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar produto ${id}:`, error);
    throw error;
  }
};

// Criar novo produto
export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  try {
    console.log('Enviando requisição para criar produto:', product);
    console.log('Headers da requisição:', api.defaults.headers);
    
    const response = await api.post('/api/product', product);
    console.log('Resposta da criação de produto:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    // Log mais detalhado do erro
    if (axios.isAxiosError(error)) {
      console.error('Status:', error.response?.status);
      console.error('Dados do erro:', error.response?.data);
      console.error('Headers da resposta:', error.response?.headers);
    }
    throw error;
  }
};

// Atualizar produto existente
export const updateProduct = async (id: number, product: Omit<Product, 'id'>): Promise<Product> => {
  try {
    console.log(product)
    const response = await api.put(`/api/product/${id}`, product);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar produto ${id}:`, error);
    throw error;
  }
};

// Atualizar apenas a imagem do produto
export const updateProductImage = async (id: number, imageUrl: string): Promise<Product> => {
  try {
    const response = await api.put(`/api/product/${id}/image`, { pictureUrl: imageUrl });
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar imagem do produto ${id}:`, error);
    throw error;
  }
};

// Excluir produto
export const deleteProduct = async (id: number): Promise<void> => {
  try {
    await api.delete(`/api/product/${id}`);
  } catch (error) {
    console.error(`Erro ao excluir produto ${id}:`, error);
    throw error;
  }
};