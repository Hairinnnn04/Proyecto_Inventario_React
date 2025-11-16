import React from 'react';
import './Header.css';

const Header = ({ onShowRegistros }) => {
  return (
    <header className="header">
      <div className="header-content">
        <h1>Sistema de Inventario</h1>
        <button className="registros-btn" onClick={onShowRegistros}>Registros</button>
      </div>
    </header>
  );
};

export default Header;
