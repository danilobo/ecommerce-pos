// src/components/FilterBar/FilterBar.tsx
import React from 'react';
import './FilterBar.css';

interface FilterBarProps {
  codeFilter: string;
  setCodeFilter: (value: string) => void;
  handleFilter: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ codeFilter, setCodeFilter, handleFilter }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleFilter();
  };

  return (
    <form className="filter-bar" onSubmit={handleSubmit}>
      <div className="filter-input-group">
        <label htmlFor="code-filter">Código:</label>
        <input
          id="code-filter"
          type="number"
          value={codeFilter}
          onChange={(e) => setCodeFilter(e.target.value)}
          placeholder="Digite o código do produto"
        />
      </div>
      <button type="submit" className="filter-button">Filtrar</button>
    </form>
  );
};

export default FilterBar;