// src/App.tsx
import React from 'react';
import { 
  createBrowserRouter, 
  RouterProvider,
  createRoutesFromElements,
  Route
} from 'react-router-dom';
import MainNavigation from './components/MainNavigation/MainNavigation';
import ProductList from './pages/ProductList/ProductList';
import NewProduct from './pages/NewProduct/NewProduct';
import { ProductProvider } from './context/ProductContext';
import { productLoader } from './loaders/productLoader';
import './App.css';

// Cria as rotas com a função loader
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route 
      path="/" 
      id="root"  // ID para a rota raiz
      element={<MainNavigation />}
      loader={productLoader}
    >
      <Route 
        index 
        element={
          <ProductProvider>
            <ProductList />
          </ProductProvider>
        } 
      />
      <Route 
        path="novo" 
        element={
          <ProductProvider>
            <NewProduct />
          </ProductProvider>
        } 
      />
    </Route>
  )
);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;