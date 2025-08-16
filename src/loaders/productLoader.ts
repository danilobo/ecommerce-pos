// src/loaders/productLoader.ts
import { getAllProducts } from '../services/productService';
import { Product } from '../types';
import { initializeAuth } from '../services/authService';

// Interface para os dados retornados pelo loader
export interface LoaderData {
  products: Product[];
}

// Função loader para carregar produtos
export async function productLoader(): Promise<LoaderData> {
  console.log('Iniciando product loader');
  
  // Garantir que o token esteja disponível
  initializeAuth();
  
  try {
    console.log('Buscando produtos da API...');
    const products = await getAllProducts();
    console.log(`${products.length} produtos carregados com sucesso`);
    return { products };
  } catch (error) {
    console.error('Erro no loader de produtos:', error);
    
    // Retornar array vazio em caso de erro
    return { products: [] };
  }
}