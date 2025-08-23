// src/pages/ProductList/ProductList.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterBar from '../../components/FilterBar/FilterBar';
import ProductCard from '../../components/ProductCard/ProductCard';
import CsvUploader from '../../components/CsvUploader/CsvUploader';
import { useProducts } from '../../context/ProductContext';
import { getProductById } from '../../services/productService';
import './ProductList.css';

const ProductList: React.FC = () => {
  const { products, isLoading, error } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [codeFilter, setCodeFilter] = useState('');
  const [showCsvUploader, setShowCsvUploader] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Atualiza os produtos filtrados quando os produtos mudarem
  useEffect(() => {
    if (!codeFilter.trim()) {
      setFilteredProducts(products);
    }
  }, [products, codeFilter]);

  const handleFilterChange = (value: string) => {
    if (!value.trim()) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => 
        product.id === parseInt(value)
      );
      setFilteredProducts(filtered);
    }
  };

  const handleSearch = async (code: string) => {
    // Limpar erros anteriores
    setSearchError(null);
    
    if (!code.trim()) {
      // Se o código estiver vazio, mostrar todos os produtos
      setFilteredProducts(products);
      return;
    }
    try {
      setSearchLoading(true);
      const product = await getProductById(code);
      
      if (product) {
        // Se encontrou o produto, mostrar apenas ele
        setFilteredProducts([product]);
      } else {
        // Se não encontrou, mostrar mensagem de erro
        setFilteredProducts([]);
        setSearchError(`Nenhum produto encontrado com o código ${code}`);
      }
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      setSearchError('Ocorreu um erro ao buscar o produto. Tente novamente.');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleNewProduct = () => {
    navigate('/novo');
  };

  const toggleCsvUploader = () => {
    setShowCsvUploader(prev => !prev);
  };

  return (
    <div className="product-list-page">
      <div className="product-list-header">
        <h2>Lista de Produtos</h2>
        <div className="product-list-actions">
          <button 
            className="new-product-button"
            onClick={handleNewProduct}
          >
            Novo produto
          </button>
          <button 
            className={`csv-toggle-button ${showCsvUploader ? 'active' : ''}`}
            onClick={toggleCsvUploader}
          >
            {showCsvUploader ? 'Ocultar importação CSV' : 'Importar CSV'}
          </button>
        </div>
      </div>
      
      {showCsvUploader && <CsvUploader />}
      
      {!showCsvUploader && (
        <>
          <FilterBar 
            codeFilter={codeFilter} 
            setCodeFilter={setCodeFilter} 
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
          />
          
          {error && <div className="error-message">{error}</div>}
          {searchError && <div className="error-message">{searchError}</div>}
          
          {(isLoading || searchLoading) ? (
            <div className="loading">Carregando produtos...</div>
          ) : (
            <div className="products-container">
              {products.length === 0 ? (
                <p className="no-products">Não existem produtos cadastrados</p>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <ProductCard key={`product-${product.id}`} product={product} />
                ))
              ) : (
                <p className="no-products">
                  {searchError || "Nenhum produto encontrado com o código informado."}
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;