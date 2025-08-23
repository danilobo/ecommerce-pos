// src/__tests__/pages/NewProduct.test.jsx
import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import NewProduct from '../../pages/NewProduct/NewProduct';

// Estado que pode ser modificado pelos testes
let mockIsLoading = false;
let mockError = null;

// Mock do ProductContext
jest.mock('../../context/ProductContext', () => {
  const addProductMock = jest.fn().mockImplementation((product) => {
    return Promise.resolve({
      id: 999,
      ...product
    });
  });
  
  return {
    useProducts: jest.fn().mockImplementation(() => ({
      addProduct: addProductMock,
      isLoading: mockIsLoading,
      error: mockError
    })),
    ProductProvider: ({ children }) => children
  };
});

// Mock do react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  MemoryRouter: ({ children }) => <div>{children}</div>
}));

describe('NewProduct', () => {
  beforeEach(() => {
    // Reset mocks e estados
    jest.clearAllMocks();
    mockIsLoading = false;
    mockError = null;
  });
  
  it('Renderiza o formulário de criação de produto corretamente', () => {
    render(
      <MemoryRouter>
        <NewProduct />
      </MemoryRouter>
    );
    
    // Verificar se os elementos do formulário estão presentes
    expect(screen.getByText('Cadastrar Novo Produto')).toBeInTheDocument();
    expect(screen.getByLabelText(/Nome do Produto/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Descrição/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Preço/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Categoria/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/URL da Imagem/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancelar/i })).toBeInTheDocument();
    
    // Verificar o botão de criar, que deve estar habilitado quando isLoading=false
    const submitButton = screen.getByRole('button', { name: /Criar/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).not.toBeDisabled();
  }, 10000);
  
  it('Permite preencher o formulário e envia os dados corretamente', async () => {
    render(
      <MemoryRouter>
        <NewProduct />
      </MemoryRouter>
    );
    
    // Obter o mock do contexto
    const { useProducts } = require('../../context/ProductContext');
    const { addProduct } = useProducts();
    
    // Preencher os campos do formulário
    await userEvent.type(screen.getByLabelText(/Nome do Produto/i), 'Produto Teste');
    await userEvent.type(screen.getByLabelText(/Descrição/i), 'Esta é uma descrição de teste');
    await userEvent.type(screen.getByLabelText(/Preço/i), '299.99');
    await userEvent.type(screen.getByLabelText(/Categoria/i), 'Teste');
    await userEvent.type(screen.getByLabelText(/URL da Imagem/i), 'https://exemplo.com/imagem.jpg');
    
    // Clicar no botão de criar
    await userEvent.click(screen.getByRole('button', { name: /Criar/i }));
    
    // Verificar se a função addProduct foi chamada com os dados corretos
    await waitFor(() => {
      expect(addProduct).toHaveBeenCalledWith({
        name: 'Produto Teste',
        description: 'Esta é uma descrição de teste',
        price: 299.99,
        category: 'Teste',
        pictureUrl: 'https://exemplo.com/imagem.jpg'
      });
    });
  }, 10000);
  
  it('Exibe mensagem de erro quando ocorre um problema no envio', async () => {
    // Configurar erro no mock
    mockError = 'Erro ao adicionar produto. Por favor, tente novamente.';
    
    // Mock de rejeição para addProduct
    const mockAddProduct = jest.fn().mockRejectedValue(new Error('Erro ao criar produto'));
    jest.spyOn(require('../../context/ProductContext'), 'useProducts')
        .mockImplementation(() => ({
          addProduct: mockAddProduct,
          isLoading: false,
          error: mockError
        }));
    
    render(
      <MemoryRouter>
        <NewProduct />
      </MemoryRouter>
    );
    
    // Verificar se a mensagem de erro é exibida
    expect(screen.getByText(/Erro ao adicionar produto/i)).toBeInTheDocument();
  }, 10000);
  
  it('Navega de volta ao cancelar a criação do produto', async () => {
    // Mock do useNavigate para poder verificar chamadas
    const navigateMock = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate')
        .mockImplementation(() => navigateMock);
    
    render(
      <MemoryRouter>
        <NewProduct />
      </MemoryRouter>
    );
    
    // Clicar no botão Cancelar
    await userEvent.click(screen.getByRole('button', { name: /Cancelar/i }));
    
    // Verificar se navigate foi chamado com o caminho correto
    expect(navigateMock).toHaveBeenCalledWith('/');
  }, 10000);
  
  it('Valida campos obrigatórios antes de enviar', async () => {
    // Mock para o evento de submit do formulário
    const mockSubmitEvent = {
      preventDefault: jest.fn()
    };
    
    render(
      <MemoryRouter>
        <NewProduct />
      </MemoryRouter>
    );
    
    // Obter o mock do contexto
    const { useProducts } = require('../../context/ProductContext');
    const { addProduct } = useProducts();
    
    // Obter o formulário e simular submit
    const form = screen.getByRole('form');
    await act(async () => {
      form.dispatchEvent(new Event('submit'));
    });
    
    // Verificar que addProduct não foi chamado
    expect(addProduct).not.toHaveBeenCalled();
    
    // Verificar validação - os campos required devem mostrar validação nativa
    const nameInput = screen.getByLabelText(/Nome do Produto/i);
    expect(nameInput).toBeRequired();
  }, 10000);
});