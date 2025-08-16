import { Product } from '../types';
import productsData from '../data.json';

// Interface para os dados retornados pelo loader
export interface LoaderData {
  products: Product[];
}

// Função loader para carregar produtos
export async function productLoader(): Promise<LoaderData> {
  // Simulação de uma chamada assíncrona
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ products: productsData as Product[] });
    }, 200);
  });
}
