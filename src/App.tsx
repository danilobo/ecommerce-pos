// src/App.tsx
import React, { useState, useEffect } from 'react';
import ProductCard from './components/ProductCard/ProductCard';
import FilterBar from './components/FilterBar/FilterBar';
import { Product } from './types';
import productsData from './data.json';
import './App.css';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [codeFilter, setCodeFilter] = useState<string>('');

  useEffect(() => {
    // Carrega os dados do arquivo data.json
    setProducts(productsData as Product[]);
    setFilteredProducts(productsData as Product[]);
  }, []);

  const handleFilter = () => {
    if (!codeFilter.trim()) {
      // Se o campo estiver vazio, exibe todos os produtos
      setFilteredProducts(products);
    } else {
      // Filtra pelo código do produto (id)
      const filtered = products.filter(product => 
        product.id === parseInt(codeFilter)
      );
      setFilteredProducts(filtered);
    }
  };

  return (
    <div className="app-container">
      <h1>Portal de Produtos</h1>
      
      <FilterBar 
        codeFilter={codeFilter} 
        setCodeFilter={setCodeFilter} 
        handleFilter={handleFilter} 
      />
      
      <div className="products-container">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="no-products">Nenhum produto encontrado com o código informado.</p>
        )}
      </div>
    </div>
  );
};

export default App;