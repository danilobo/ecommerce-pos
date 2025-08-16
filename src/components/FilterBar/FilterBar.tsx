// src/components/FilterBar/FilterBar.tsx
import React, { useEffect, useState } from 'react';
import './FilterBar.css';

interface FilterBarProps {
  codeFilter: string;
  setCodeFilter: (value: string) => void;
  onFilterChange: (value: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  codeFilter, 
  setCodeFilter, 
  onFilterChange 
}) => {
  // Estado local para controlar o valor do input
  const [inputValue, setInputValue] = useState(codeFilter);
  
  // Efeito para implementar o debounce
  useEffect(() => {
    // Configura um timer que será acionado após 500ms
    const timerId = setTimeout(() => {
      // Atualiza o codeFilter no componente pai
      setCodeFilter(inputValue);
      // Executa a função de filtragem
      onFilterChange(inputValue);
    }, 500);
    
    // Limpa o timer se o componente for desmontado ou o inputValue mudar
    return () => clearTimeout(timerId);
  }, [inputValue, setCodeFilter, onFilterChange]);

  // Manipula as mudanças no input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="filter-bar">
      <div className="filter-input-group">
        <label htmlFor="code-filter">Código:</label>
        <input
          id="code-filter"
          type="number"
          value={inputValue}
          onChange={handleChange}
          placeholder="Digite o código do produto"
        />
      </div>
      {/* Botão de filtrar foi removido */}
    </div>
  );
};

export default FilterBar;