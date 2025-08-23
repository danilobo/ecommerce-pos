// src/components/CsvUploader/CsvUploader.tsx
import React, { useState, useRef } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import { useProducts } from '../../context/ProductContext';
import { Product } from '../../types';
import './CsvUploader.css';

const CsvUploader: React.FC = () => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvProducts, setCsvProducts] = useState<Partial<Product>[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
  const [uploadResults, setUploadResults] = useState<Record<number, { success: boolean; message: string }>>({}); 
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addProduct } = useProducts();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadResults({});
    
    if (!file) {
      setCsvFile(null);
      setCsvProducts([]);
      return;
    }

    // Verificar se é um arquivo CSV
    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert('Extensão de arquivo inválida');
      setCsvFile(null);
      setCsvProducts([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setCsvFile(file);
    parseCsvFile(file);
  };

  const parseCsvFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const lines = content.split('\n');
      const headers = lines[0].split(',').map(header => header.trim());
      
      const products: Partial<Product>[] = [];
      
      // Processar cada linha (ignorando o cabeçalho)
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const values = lines[i].split(',').map(value => value.trim());
        const product: Partial<Product> = {};
        
        headers.forEach((header, index) => {
          if (header === 'id' && values[index]) {
            product.id = parseInt(values[index]);
          } else if (header === 'name') {
            product.name = values[index];
          } else if (header === 'description') {
            product.description = values[index];
          } else if (header === 'price' && values[index]) {
            product.price = parseFloat(values[index]);
          } else if (header === 'category') {
            product.category = values[index];
          } else if (header === 'pictureUrl') {
            product.pictureUrl = values[index];
          }
        });
        
        if (product.name && product.price !== undefined) {
          // Gerar ID temporário para produtos do CSV
          if (product.id === undefined) {
            product.id = -i; // ID negativo para evitar colisão com produtos reais
          }
          products.push(product);
        }
      }
      
      setCsvProducts(products);
    };
    
    reader.readAsText(file);
  };

  const handleProductSelection = (id: number | undefined) => {
    if (id === undefined) return;
    
    setSelectedProducts(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(id)) {
        newSelection.delete(id);
      } else {
        newSelection.add(id);
      }
      return newSelection;
    });
  };

  const handleUpload = async () => {
    if (!csvProducts.length || selectedProducts.size === 0) return;
    
    setIsUploading(true);
    const results: Record<number, { success: boolean; message: string }> = {};
    
    // Processar cada produto selecionado
    for (const product of csvProducts) {
      if (product.id !== undefined && selectedProducts.has(product.id)) {
        try {
          // Remover o ID temporário antes de enviar
          const { id, ...productWithoutId } = product;
          const newProduct = await addProduct(productWithoutId as Omit<Product, 'id'>);
          results[product.id] = { 
            success: true, 
            message: `Produto "${newProduct.name}" criado com sucesso!`
          };
        } catch (error) {
          results[product.id] = {
            success: false,
            message: error instanceof Error ? error.message : 'Erro ao criar produto'
          };
        }
      }
    }
    
    setUploadResults(results);
    setIsUploading(false);
  };

  const resetUploader = () => {
    setCsvFile(null);
    setCsvProducts([]);
    setSelectedProducts(new Set());
    setUploadResults({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="csv-uploader">
      <h2>Carregar Produtos por CSV</h2>
      
      <div className="upload-controls">
        <div className="file-input-container">
          <label htmlFor="csv-file">Arquivo CSV:</label>
          <input
            ref={fileInputRef}
            id="csv-file"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>
        
        <div className="upload-actions">
          <button
            className="send-button"
            onClick={handleUpload}
            disabled={!csvFile || selectedProducts.size === 0 || isUploading}
          >
            {isUploading ? 'Enviando...' : 'Enviar'}
          </button>
          
          {csvProducts.length > 0 && (
            <button
              className="reset-button"
              onClick={resetUploader}
              disabled={isUploading}
            >
              Limpar
            </button>
          )}
        </div>
      </div>
      
      {csvProducts.length > 0 && (
        <div className="selection-info">
          <p>Produtos selecionados: {selectedProducts.size} de {csvProducts.length}</p>
        </div>
      )}
      
      <div className="csv-products-container">
        {csvProducts.map((product) => (
          <div key={`csv-product-${product.id}`} className="csv-product-wrapper">
            <div className="csv-product-card">
              {/* Renderiza o ProductCard em modo especial (sem botões de edição/exclusão) */}
              {product.id !== undefined && (
                <>
                  <div className="csv-product-display">
                    <img 
                      src={product.pictureUrl || 'https://via.placeholder.com/150'} 
                      alt={product.name || 'Produto'} 
                      className="product-image"
                    />
                    
                    <div className="card-details">
                      <h2 className="card-title">{product.name}</h2>
                      <p className="card-category">{product.category}</p>
                      <p className="card-price">
                        {product.price !== undefined ? new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(product.price) : 'Preço não definido'}
                      </p>
                      <p className="card-description">{product.description}</p>
                    </div>

                    <div className="product-selection">
                      <label className="checkbox-container">
                        <input 
                          type="checkbox" 
                          checked={selectedProducts.has(product.id)}
                          onChange={() => handleProductSelection(product.id)}
                          disabled={isUploading}
                        />
                        <span className="checkmark"></span>
                        Selecionar
                      </label>
                    </div>
                  </div>

                  {/* Mostrar resultado do upload se disponível */}
                  {uploadResults[product.id] && (
                    <div className={`upload-result ${uploadResults[product.id].success ? 'success' : 'error'}`}>
                      {uploadResults[product.id].message}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CsvUploader;