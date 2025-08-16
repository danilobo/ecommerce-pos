// src/pages/ProductList/ProductList.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterBar from '../../components/FilterBar/FilterBar';
import ProductCard from '../../components/ProductCard/ProductCard';
import { useProducts } from '../../context/ProductContext';
import './ProductList.css';

const ProductList: React.FC = () => {
  const { products } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [codeFilter, setCodeFilter] = useState('');
  const navigate = useNavigate();

  // Atualiza os produtos filtrados quando os produtos mudarem
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const handleFilter = () => {
    if (!codeFilter.trim()) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => 
        product.id === parseInt(codeFilter)
      );
      setFilteredProducts(filtered);
    }
  };

  const handleNewProduct = () => {
    navigate('/novo');
  };

  return (
    <div className="product-list-page">
      <div className="product-list-header">
        <h2>Lista de Produtos</h2>
        <button 
          className="new-product-button"
          onClick={handleNewProduct}
        >
          Novo produto
        </button>
      </div>
      
      <FilterBar 
        codeFilter={codeFilter} 
        setCodeFilter={setCodeFilter} 
        handleFilter={handleFilter} 
      />
      
      {/* Reutiliza a classe products-container existente */}
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

export default ProductList;