import React, { useState } from 'react';
import API_ENDPOINTS from '../config/apiConfig';

const DispatchForm = ({ materials, onDispatch, fetchMaterials }) => {
  const [selectedMaterialId, setSelectedMaterialId] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMaterialId || !quantity) {
      alert('Por favor, selecciona un material y una cantidad.');
      return;
    }

    const selectedMaterial = materials.find(material => material.id === parseInt(selectedMaterialId));
    if (selectedMaterial && parseInt(quantity) > selectedMaterial.quantity) {
      alert(`No se puede despachar más de lo disponible. Disponible: ${selectedMaterial.quantity}`);
      return;
    }

    const despachoData = {
      material_id: selectedMaterialId,
      cantidad: quantity,
      fecha: new Date().toISOString().split('T')[0],
    };

    console.log('Datos enviados al backend:', despachoData);

    try {
      const response = await fetch(API_ENDPOINTS.despachos, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(despachoData),
      });

      if (response.ok) {
        alert('Despacho registrado correctamente');
        setQuantity('');
        setSelectedMaterialId('');
        fetchMaterials(); // Actualizar la lista de materiales
      } else {
        alert('Error al registrar el despacho');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al conectar con el servidor');
    }
  };

  return (
    <div>
      <h2>Despachar Material</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="materialSelect" className="form-label">Selecciona un Material</label>
          <select
            id="materialSelect"
            className="form-select"
            value={selectedMaterialId}
            onChange={(e) => setSelectedMaterialId(e.target.value)}
          >
            <option value="">-- Elige un material --</option>
            {materials.map(material => (
              <option key={material.id} value={material.id}>
                {material.name} (Disponible: {material.quantity})
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="dispatchQuantity" className="form-label">Cantidad a Despachar</label>
          <input
            type="number"
            className="form-control"
            id="dispatchQuantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-warning">Despachar</button>
      </form>
    </div>
  );
};

export default DispatchForm;
