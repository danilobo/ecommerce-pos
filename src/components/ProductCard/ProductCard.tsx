import React from 'react';
import { Product } from '../../types';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleEdit = () => {
    alert('Editar clicked!');
  };

  const handleDelete = () => {
    alert('Excluir clicked!');
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
        <button className="delete-btn" onClick={handleDelete}>Excluir</button>
      </div>
    </div>
  );
};

export default ProductCard;