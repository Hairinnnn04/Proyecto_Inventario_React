import React, { useEffect, useState } from 'react';
import API_ENDPOINTS from '../config/apiConfig';

const Movimientos = () => {
  const [movs, setMovs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovimientos = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.movimientos);
        if (!res.ok) throw new Error('Error al obtener movimientos');
        const data = await res.json();
        setMovs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMovimientos();
  }, []);

  if (loading) return <div>Cargando registros...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Registros de Movimientos</h2>
        <div>
          <button className="btn btn-sm btn-primary" onClick={() => exportToPDF(movs)}>Exportar PDF</button>
        </div>
      </div>

      <div className="movimientos-list">
        {movs.length === 0 && <p>No hay movimientos registrados.</p>}

        {movs.map((m) => (
          <div key={m.id} className="movimiento-item" style={{ padding: '0.75rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <strong>{m.tipo}</strong> — {m.direccion}
                <div style={{ color: '#555' }}>{m.material_nombre ? m.material_nombre : 'Material N/A'}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div>{new Date(m.fecha_movimiento).toLocaleString()}</div>
                <div>Cantidad: {m.cantidad}</div>
                <div>Precio total: {m.precio_total}</div>
              </div>
            </div>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

// Función para exportar a PDF usando ventana imprimible (el usuario puede escoger "Guardar como PDF")
function exportToPDF(movimientos) {
  const title = 'Registros de Movimientos';
  const style = `
    <style>
      body { font-family: Arial, Helvetica, sans-serif; padding: 20px; }
      table { width: 100%; border-collapse: collapse; }
      th, td { border: 1px solid #ddd; padding: 8px; }
      th { background: #f2f2f2; }
      .right { text-align: right; }
    </style>
  `;

  const rows = movimientos.map(m => {
    const fecha = new Date(m.fecha_movimiento).toLocaleString();
    const material = m.material_nombre ? m.material_nombre : 'Material N/A';
    return `
      <tr>
        <td>${fecha}</td>
        <td>${escapeHtml(m.tipo)}</td>
        <td>${escapeHtml(m.direccion)}</td>
        <td>${escapeHtml(material)}</td>
        <td class="right">${m.cantidad}</td>
        <td class="right">${m.precio_total}</td>
      </tr>
    `;
  }).join('');

  const html = `
    <html>
      <head>
        <title>${title}</title>
        ${style}
      </head>
      <body>
        <h2>${title}</h2>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Dirección</th>
              <th>Material</th>
              <th>Cantidad</th>
              <th>Precio total</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </body>
    </html>
  `;

  const newWindow = window.open('', '_blank');
  newWindow.document.open();
  newWindow.document.write(html);
  newWindow.document.close();
  // Dar tiempo a que se renderice
  setTimeout(() => {
    newWindow.focus();
    newWindow.print();
    // newWindow.close(); // No cerrar automáticamente para que el usuario pueda guardar el PDF
  }, 500);
}

function escapeHtml(text) {
  if (text === null || text === undefined) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default Movimientos;
