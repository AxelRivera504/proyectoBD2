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
import Clients from './pages/Clients';
import Suppliers from './pages/Supplier';
import VentasContado from './pages/VentaContado';
import VentasMayorista from './pages/VentaMayorista';
import PurchaseOrders from './pages/PurchaseOrders';
import AccountsPayable from './pages/SupplierPayment';
import DevolucionProveedor from './pages/DevolucionProveedor';
import ElaboracionProductos from './pages/elaboracionProductos';
import Reportes from './pages/reportes';
import "./App.css";

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
          <Route path="/elaboracion" element={<ElaboracionProductos />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/purchaseOrders" element={<PurchaseOrders />} />
          <Route path="/supplierPayment" element={<AccountsPayable />} />
          <Route path="/devolutions" element={<DevolucionProveedor />} />
          <Route path="/ventasDetalle" element={<VentasContado />} />
          <Route path="/ventasMayorista" element={<VentasMayorista />} />
          <Route path="/reportes" element={<Reportes />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;