// src/components/Layout/Layout.tsx
import React from 'react';
import { Outlet, useLoaderData } from 'react-router-dom';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import { LoaderData } from '../../loaders/productLoader';
import './MainNavigation.css';

const MainNavigation: React.FC = () => {
    // Acessar os dados carregados pelo loader
    const data = useLoaderData() as LoaderData;   
    return (
    <div className="navigation">
      <Header />
      <div className="navigation-content">
        <Sidebar />
        <main className="main-content">
          <div className="app-container">
            <Outlet context={data} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainNavigation;