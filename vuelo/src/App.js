import React, { useState, useEffect } from 'react';
import vuelosData from './vuelos.json';

const App = () => {
  const [vuelos, setVuelos] = useState([]);
  const [vueloSeleccionado, setVueloSeleccionado] = useState(null);

  useEffect(() => {
    if (Array.isArray(vuelosData)) {
      setVuelos(vuelosData);
    }
  }, []);

  const seleccionarVuelo = (vuelo, destino) => {
    setVueloSeleccionado({ ...vuelo, destino });
  };

  return (
    <div>
      <h1>Listado de Vuelos</h1>
      {vuelos.length > 0 ? (
        vuelos.map((destino, index) => (
          <div key={index}>
            <h2>{destino.destination}</h2>
            <ul>
              {destino.flights.map((vuelo, index) => (
                <li key={index}>
                  {vuelo.number} - {vuelo.date}
                  <button onClick={() => seleccionarVuelo(vuelo, destino.destination)}>Seleccionar</button>
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>Cargando vuelos...</p>
      )}
      {vueloSeleccionado && (
        <div>
          <h3>Detalles del Vuelo</h3>
          <p>Destino: {vueloSeleccionado.destino}</p>
          <p>Fecha: {vueloSeleccionado.date}</p>
          <p>Hora: {vueloSeleccionado.time}</p>
          <p>Plazas: {vueloSeleccionado.seats}</p>
          <p>Plazas disponibles: {vueloSeleccionado.available_seats}</p>
          <p>Plazas ocupadas: {vueloSeleccionado.occupied_seats}</p>
        </div>
      )}
    </div>
  );
};

export default App;
