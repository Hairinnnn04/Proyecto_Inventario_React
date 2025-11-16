import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import MaterialForm from './components/MaterialForm';
import DispatchForm from './components/DispatchForm';
import MaterialList from './components/MaterialList';
import Movimientos from './components/Movimientos';
import './App.css';

function App() {
  const [view, setView] = useState('existentes'); // Vistas: 'ingresar', 'despachar', 'existentes'
  const [materials, setMaterials] = useState([]);

  const fetchMaterials = useCallback(async () => {
    try {
      const response = await fetch('http://localhost/FACTURACION/api/materiales.php');
      if (response.ok) {
        const data = await response.json();
        const mappedMaterials = data.map(material => ({
          id: material.id,
          name: material.nombre,
          quantity: material.cantidad,
          price: parseFloat(material.precio),
          unit: material.unidad,
        }));
        setMaterials(mappedMaterials);
      } else {
        console.error('Error al obtener los materiales');
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
    }
  }, []);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  const handleAddMaterial = (material) => {
    const newMaterial = { ...material, id: Date.now() };
    setMaterials([...materials, newMaterial]);
    alert('Material añadido con éxito');
    setView('existentes'); // Cambiar a la vista de existentes después de añadir
  };

  const handleDispatchMaterial = (materialId, quantity) => {
    const updatedMaterials = materials.map(material => {
      if (material.id === materialId) {
        if (material.quantity < quantity) {
          alert(`No hay suficiente stock de ${material.name}. Disponible: ${material.quantity}`);
          return material; // No hacer cambios si no hay stock
        }
        return { ...material, quantity: material.quantity - quantity };
      }
      return material;
    });

    const dispatchedMaterial = materials.find(m => m.id === materialId);
    if (dispatchedMaterial && dispatchedMaterial.quantity >= quantity) {
      setMaterials(updatedMaterials);
      alert('Material despachado con éxito');
      setView('existentes');
    }
  };

  

  const renderView = () => {
    switch (view) {
      case 'ingresar':
        return <MaterialForm onAddMaterial={handleAddMaterial} fetchMaterials={fetchMaterials} />;
      case 'despachar':
        return <DispatchForm materials={materials} onDispatch={handleDispatchMaterial} fetchMaterials={fetchMaterials} />;
      case 'registros':
        return <Movimientos />;
      case 'existentes':
      default:
        return <MaterialList materials={materials} />;
    }
  };

  return (
    <div className="App">
  <Header onShowRegistros={() => setView('registros')} />
      <nav className="nav nav-pills justify-content-center my-4">
        <button className={`nav-link ${view === 'existentes' ? 'active' : ''}`} onClick={() => setView('existentes')}>
          Materiales Existentes
        </button>
        <button className={`nav-link ${view === 'ingresar' ? 'active' : ''}`} onClick={() => setView('ingresar')}>
          Ingresar Material
        </button>
        <button className={`nav-link ${view === 'despachar' ? 'active' : ''}`} onClick={() => setView('despachar')}>
          Despachar Material
        </button>
      </nav>
      <main className="container mt-4">
        {renderView()}
      </main>
    </div>
  );
}

export default App;
