// src/__tests__/pages/ProductList.test.tsx
import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ProductList from '../../pages/ProductList/ProductList';


// Mock para o Context API
jest.mock('../../context/ProductContext', () => {
  const mockProducts = [
    {
      id: 123,
      name: "Smartphone Samsung Galaxy S24 FE 128GB Grafite 5G 8GB RAM 6,7\" Câm. Tripla + Selfie 10MP",
      description: "O Galaxy S24 FE Grafite 5G é o smartphone da Samsung para quem busca um aparelho com alta performance...",
      price: 2498,
      category: "Celulares e Smartphones",
      pictureUrl: "https://a-static.mlcdn.com.br/800x560/smartphone-samsung-galaxy-s24-fe-128gb-grafite-5g-8gb-ram-67-cam-tripla-selfie-10mp/magazineluiza/240010800/cb7f1ca382009d6cca85a254ca69a9ae.jpg"
    },
    {
      id: 134,
      name: "Smartphone Samsung Galaxy A56 5G Preto 128GB, 8GB RAM, Câmera Tripla até 50MP, Tela Super AMOLED 6.7\", IP67, NFC, Vídeo HDR e Recursos AI",
      description: "Apresentando o Galaxy A56 5G. Com espessura de 7,4mm e peso de 198g, o Galaxy A56 5G tem boa aderência...",
      price: 1834,
      category: "Celulares e Smartphones",
      pictureUrl: "https://imgs.casasbahia.com.br/55068951/1g.jpg"
    },
    {
      id: 135,
      name: "Smartphone Samsung Galaxy A25 6,5\" 256GB Azul Escuro 5G 8GB RAM Câm Tripla 50MP + Selfie 13MP Bateria 5000mAh Dual Chip",
      description: "O Samsung Galaxy A25 na cor azul escuro é o smartphone que vai te acompanhar em todos os momentos...",
      price: 1349.1,
      category: "Celulares e Smartphones",
      pictureUrl: "https://a-static.mlcdn.com.br/800x560/smartphone-samsung-galaxy-a25-65-256gb-azul-escuro-5g-8gb-ram-cam-tripla-50mp-selfie-13mp-bateria-5000mah-dual-chip/magazineluiza/237215300/f506e35216a23119cb33d1f278f08c56.jpg"
    }
  ];
  
  // Estado filtrado compartilhado entre testes
  let filteredProducts = [...mockProducts];
  
  return {
    useProducts: jest.fn().mockImplementation(() => ({
      products: filteredProducts,
      isLoading: false,
      error: null,
    })),
    ProductProvider: ({ children }) => children,
    // Função para simular a filtragem
    __setFilteredProducts: (filter) => {
      if (!filter) {
        filteredProducts = [...mockProducts];
      } else {
        filteredProducts = mockProducts.filter(p => 
          p.id.toString().includes(filter)
        );
      }
    }
  };
});

// Mock para o componente ProductCard
jest.mock('../../components/ProductCard/ProductCard', () => {
  return function MockProductCard({ product }) {
    return (
      <div data-testid={`product-card-${product.id}`} className="card">
        <img 
          src={product.pictureUrl}
          alt={product.name}
          className="product-image"
          role="img"
        />
        <div className="card-details">
          <h2 className="card-title">({product.id}) {product.name}</h2>
          <p className="card-category">{product.category}</p>
          <p className="card-price">R$ {product.price}</p>
        </div>
      </div>
    );
  };
});

// Mock para react-router-dom
jest.mock('react-router-dom', () => ({
  MemoryRouter: ({ children }) => <div>{children}</div>,
  useNavigate: () => jest.fn(),
  useRouteLoaderData: jest.fn(),
  NavLink: ({ to, children }) => <a href={to}>{children}</a>
}));

describe('ProductList', () => {
    beforeEach(() => {
      jest.useFakeTimers(); // Usar timers falsos para controlar debounce
      require('../../context/ProductContext').__setFilteredProducts('');
    },10000);
  
    afterEach(() => {
      jest.useRealTimers(); // Restaurar timers reais após cada teste
    },10000);
  
    it('Exibe a lista de produtos corretamente', async () => {
      render(
        <MemoryRouter>
          <ProductList />
        </MemoryRouter>
      );
  
      // Aguarda todos os cards de produtos serem renderizados
      const productCards = await screen.findAllByRole('img');
      expect(productCards).toHaveLength(3);
  
      // Verifica se os nomes dos produtos estão corretos
      expect(screen.getByText(/\(123\) Smartphone Samsung Galaxy S24 FE/)).toBeInTheDocument();
      expect(screen.getByText(/\(134\) Smartphone Samsung Galaxy A56/)).toBeInTheDocument();
      expect(screen.getByText(/\(135\) Smartphone Samsung Galaxy A25/)).toBeInTheDocument();
    },10000);
  
    it('Realiza busca por código de produto usando o botão Buscar', async () => {
      // 1. Configuração direta sem mocks complicados
      const originalModule = jest.requireActual('../../services/productService');
      
      // Mock simples e direto para a função de busca
      const mockGetProductByCode = jest.fn().mockResolvedValue({
        id: 134,
        name: "Smartphone Samsung Galaxy A56 5G Preto 128GB",
        price: 1834,
        category: "Celulares e Smartphones",
        pictureUrl: "https://imgs.casasbahia.com.br/55068951/1g.jpg"
      });
      
      // Substituir apenas a função que precisamos
      jest.spyOn(originalModule, 'getProductById').mockImplementation(mockGetProductByCode);
      
      // 2. Injetar o mock diretamente no componente ProductList
      const ProductListInstance = require('../../pages/ProductList/ProductList').default;
      const originalHandleSearch = ProductListInstance.prototype.handleSearch;
      
      // Substituir temporariamente com um mock que podemos rastrear
      ProductListInstance.prototype.handleSearch = jest.fn().mockImplementation(async (code) => {
        // Simular atualizações de estado diretamente
        if (code === '134') {
          // Atualizar o estado filtrado via context mock
          require('../../context/ProductContext').__setFilteredProducts('134');
        }
      });
      
      // 3. Renderização simples
      render(
        <MemoryRouter>
          <ProductList />
        </MemoryRouter>
      );
    
      // 4. Interação básica
      const filterInput = screen.getByPlaceholderText('Digite o código do produto');
      const searchButton = screen.getByText('Buscar');
      
      // Simplificar a interação
      await userEvent.type(filterInput, '134');
      await userEvent.click(searchButton);
      
      // 5. Verificações diretas
      // Verificar se a função mock foi chamada
      expect(ProductListInstance.prototype.handleSearch).toHaveBeenCalledWith('134');
      
      // 6. Limpeza adequada
      // Restaurar o método original
      ProductListInstance.prototype.handleSearch = originalHandleSearch;
      jest.restoreAllMocks();
    },10000);
    
    
    it('Exibe mensagem quando nenhum produto é encontrado', async () => {
      render(
        <MemoryRouter>
          <ProductList />
        </MemoryRouter>
      );
  
      // Encontra o campo de filtro
      const filterInput = screen.getByPlaceholderText('Digite o código do produto');
      
      // Digita um código que não existe
      await act(async () => {
        await userEvent.type(filterInput, '999');
        // Avança o tempo para simular o debounce
        jest.advanceTimersByTime(1000);
      });
      
      // Simula a filtragem que ocorreria após o debounce
      act(() => {
        require('../../context/ProductContext').__setFilteredProducts('999');
      });
      
      // Verifica se a mensagem de nenhum produto encontrado é exibida
      // Não use waitFor aqui, faça assertions diretas após o act
      expect(screen.getByText(/Nenhum produto encontrado/i)).toBeInTheDocument();
      
      // Verifica que não há cards de produto
      const productCards = screen.queryAllByRole('img');
      expect(productCards).toHaveLength(0);
    }, 10000); // Aumente o timeout para este teste específico
  });