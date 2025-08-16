// src/components/ProductCard/ProductCard.tsx
import React from 'react';
import { Product } from '../../types';
import { useProducts } from '../../context/ProductContext';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { deleteProduct, isLoading } = useProducts();

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleEdit = () => {
    alert('Editar clicked!');
    // Futura navegação para página de edição
    // navigate(`/editar/${product.id}`)
  };

  const handleDelete = async () => {
    if (window.confirm(`Tem certeza que deseja excluir o produto "${product.name}"?`)) {
      await deleteProduct(product.id);
    }
  };

  return (
    <div className="card">
      <img 
        src={product.pictureUrl} 
        alt={product.name} 
        className="product-image" 
      />
      
      <div className="card-details">
        <h2 className="card-title">({product.id}) {product.name}</h2>
        <p className="card-category">{product.category}</p>
        <p className="card-price">{formatPrice(product.price)}</p>
      </div>

      <div className="card-buttons">
        <button className="edit-btn" onClick={handleEdit}>Editar</button>
        <button 
          className="delete-btn" 
          onClick={handleDelete}
          disabled={isLoading}
        >
          {isLoading ? 'Aguarde...' : 'Excluir'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;