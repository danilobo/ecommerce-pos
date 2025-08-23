// src/components/ProductCard/ProductCard.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { Product } from '../../types';
import { useProducts } from '../../context/ProductContext';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product: initialProduct }) => {
  const { products, deleteProduct, updateProduct, isLoading } = useProducts();
  const [isEditing, setIsEditing] = useState(false);
  
  // Buscar a versão mais atualizada do produto do contexto
  const product = useMemo(() => {
    return products.find(p => p.id === initialProduct.id) || initialProduct;
  }, [products, initialProduct.id]);
  
  // Estado para o produto em edição - inicializar com valores vazios seguros
  const [editedProduct, setEditedProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    description: '',
    price: 0,
    category: '',
    pictureUrl: ''
  });

  // Atualizar o estado editedProduct quando o produto mudar ou quando entrar no modo de edição
  useEffect(() => {
    setEditedProduct({
      name: product.name || '',
      description: product.description || '',
      price: product.price || 0,
      category: product.category || '',
      pictureUrl: product.pictureUrl || ''
    });
  }, [product, isEditing]); // Dependência em isEditing para resetar quando começar a editar

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    try {
      await updateProduct(product.id, editedProduct);
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao salvar edição:', error);
      // Opcionalmente, mostrar uma mensagem de erro para o usuário
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setEditedProduct(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  const handleDelete = async () => {
    if (window.confirm(`Tem certeza que deseja excluir o produto "${product.name}"?`)) {
      await deleteProduct(product.id);
    }
  };

  return (
    <div className={`card ${isEditing ? 'editing' : ''}`}>
      {isEditing ? (
        // Modo de edição
        <>
          <div className="product-image-container">
            <img 
              src={editedProduct.pictureUrl || 'https://via.placeholder.com/150'} 
              alt={editedProduct.name || 'Produto'} 
              className="product-image"
            />
            <input
              type="text"
              name="pictureUrl"
              value={editedProduct.pictureUrl || ''}
              onChange={handleInputChange}
              className="image-url-input"
              placeholder="URL da imagem"
            />
          </div>
          
          <div className="card-details">
            <input
              type="text"
              name="name"
              value={editedProduct.name || ''}
              onChange={handleInputChange}
              className="edit-title-input"
              placeholder="Nome do produto"
            />
            
            <input
              type="text"
              name="category"
              value={editedProduct.category || ''}
              onChange={handleInputChange}
              className="edit-category-input"
              placeholder="Categoria"
            />
            
            <div className="price-input-container">
              <input
                type="number"
                name="price"
                value={editedProduct.price || 0}
                onChange={handleInputChange}
                className="edit-price-input"
                min="0"
                step="0.01"
                placeholder="Preço"
              />
            </div>
            
            <textarea
              name="description"
              value={editedProduct.description || ''}
              onChange={handleInputChange}
              className="edit-description-input"
              placeholder="Descrição do produto"
              rows={3}
            />
          </div>

          <div className="card-buttons edit-mode-buttons">
            <button 
              className="cancel-btn" 
              onClick={handleCancelEdit}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button 
              className="save-btn" 
              onClick={handleSaveEdit}
              disabled={isLoading}
            >
              {isLoading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </>
      ) : (
        // Modo de visualização
        <>
          <img 
            src={product.pictureUrl || 'https://via.placeholder.com/150'} 
            alt={product.name || 'Produto'} 
            className="product-image" 
          />
          
          <div className="card-details">
            <h2 className="card-title">({product.id}) {product.name}</h2>
            <p className="card-category">{product.category}</p>
            <p className="card-price">{formatPrice(product.price)}</p>
            <p className="card-description">{product.description}</p>
          </div>

          <div className="card-buttons">
            <button 
              className="edit-btn" 
              onClick={handleEdit}
              disabled={isLoading}
            >
              Editar
            </button>
            <button 
              className="delete-btn" 
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? 'Aguarde...' : 'Excluir'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductCard;