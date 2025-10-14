import React, { useState, useEffect } from 'react';
import API_ENDPOINTS from '../config/apiConfig';

const MaterialList = () => {
  const [materiales, setMateriales] = useState([]);

  useEffect(() => {
    const fetchMateriales = async () => {
      try {
        console.log('Realizando solicitud al backend...'); // Log para depuración
        const response = await fetch(API_ENDPOINTS.materiales);
        if (response.ok) {
          const data = await response.json();
          console.log('Datos recibidos del backend:', data); // Log para verificar los datos
          const mappedData = data.map(material => ({
            id: material.id,
            name: material.nombre,
            quantity: material.cantidad,
            unit: material.unidad,
            price: parseFloat(material.precio), // Convertir 'price' a número
          }));
          console.log('Datos mapeados:', mappedData); // Log para verificar el mapeo
          setMateriales(mappedData);
        } else {
          console.error('Error al obtener los materiales');
        }
      } catch (error) {
        console.error('Error al conectar con el servidor:', error);
      }
    };

    fetchMateriales();
  }, []);

  const [filter, setFilter] = useState('');

  const filteredMaterials = materiales.filter(material =>
    material.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Materiales Existentes</h2>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Filtrar por nombre..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Cantidad</th>
            <th>Unidad</th>
            <th>Precio</th>
          </tr>
        </thead>
        <tbody>
          {filteredMaterials.map(material => (
            <tr key={material.id}>
              <td>{material.id}</td>
              <td>{material.name}</td>
              <td>{material.quantity < 0 ? 0 : material.quantity}</td>
              <td>{material.unit}</td>
              <td>${material.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MaterialList;
