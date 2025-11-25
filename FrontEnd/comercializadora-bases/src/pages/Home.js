import React from 'react';
import Dashboard from '../components/Dashboard/Dashboard';

const Home = () => {
  return (
    <div className="container">
      <section id="dashboard">
        <h2 className="section-title">Inicio</h2>
        <Dashboard />
      </section>
    </div>
  );
};

export default Home;