import React, { useState } from 'react';
import API_ENDPOINTS from '../config/apiConfig';

const MaterialForm = ({ onAddMaterial, fetchMaterials }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('Unidades'); // Estado para la unidad

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !quantity || !price) {
      alert('Por favor, completa todos los campos.');
      return;
    }
    const materialData = { name, quantity: parseInt(quantity), price: parseFloat(price), unit };
    console.log('Datos enviados al backend:', materialData);
    try {
      const response = await fetch(API_ENDPOINTS.materiales, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(materialData),
      });

      console.log('Respuesta del servidor:', response); // Log para depuración

      if (response.ok) {
        alert('Material añadido correctamente');
        setName('');
        setQuantity('');
        setPrice('');
        fetchMaterials(); // Actualizar la lista de materiales
      } else {
        const errorData = await response.text(); // Obtener detalles del error
        console.error('Error en la respuesta del servidor:', errorData);
        alert('Error al añadir el material');
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      alert('Error al conectar con el servidor');
    }
  };

  return (
    <div>
      <h2>Ingresar Material</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="materialName" className="form-label">Nombre del Material</label>
          <input
            type="text"
            className="form-control"
            id="materialName"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="quantity" className="form-label">Cantidad</label>
            <input
              type="number"
              className="form-control"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="unit" className="form-label">Unidad de Medida</label>
            <select 
              id="unit" 
              className="form-select" 
              value={unit} 
              onChange={(e) => setUnit(e.target.value)}
            >
              <option>Unidades</option>
              <option>Cajas</option>
              <option>Libras</option>
              <option>Metros</option>
              <option>Galones</option>
              <option>Quintales</option>
              <option>Latas</option>
              <option>Bolsas</option>
              <option>Botes</option>
              <option>Juegos</option>
            </select>
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">Precio (por unidad)</label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-success">Ingresar Material</button>
      </form>
    </div>
  );
};

export default MaterialForm;
