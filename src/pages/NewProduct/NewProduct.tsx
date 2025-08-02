// src/pages/NewProduct/NewProduct.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import './NewProduct.css';

const NewProduct: React.FC = () => {
  const navigate = useNavigate();
  const { addProduct } = useProducts();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    pictureUrl: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Converter o preço para número
    const newProduct = {
      ...formData,
      price: parseFloat(formData.price)
    };
    
    addProduct(newProduct);
    navigate('/');
  };
  
  const handleCancel = () => {
    navigate('/');
  };
  
  return (
    <div className="new-product-page">
      <h2>Cadastrar Novo Produto</h2>
      
      <form className="new-product-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nome do Produto</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Descrição</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={5}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="price">Preço</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Categoria</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="pictureUrl">URL da Imagem</label>
          <input
            type="url"
            id="pictureUrl"
            name="pictureUrl"
            value={formData.pictureUrl}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-buttons">
          <button type="button" className="cancel-button" onClick={handleCancel}>
            Cancelar
          </button>
          <button type="submit" className="create-button">
            Criar
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewProduct;