import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import Navigation from './components/Layout/Navigation';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import Purchases from './pages/Purchases';
import Sales from './pages/Sales';
import Inventory from './pages/Inventory';

function App() {
  const [currentSection, setCurrentSection] = useState('dashboard');

  return (
    <div className="App">
      <Header />
      <Navigation currentSection={currentSection} setCurrentSection={setCurrentSection} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Products />} />
          <Route path="/compras" element={<Purchases />} />
          <Route path="/ventas" element={<Sales />} />
          <Route path="/inventario" element={<Inventory />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;