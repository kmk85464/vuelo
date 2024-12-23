// App.js
import React, { useState } from 'react';
import vuelosData from './vuelos.json'; // Ajusta la ruta según la ubicación del archivo

function onSeleccionarVuelo(vuelo) {
  console.log('Vuelo seleccionado:', vuelo);
}

function App() {
  const [flights] = useState(vuelosData); // Inicializa el estado con los datos del JSON
  const [vueloSeleccionado, setVueloSeleccionado] = useState(null); // Estado para el vuelo seleccionado
  const [vuelos] = useState(vuelosData || []); // Carga los datos iniciales
  return (
    <div className="App">
      <header>
        <h1>Listado de Vuelos</h1>
      </header>
      <main>
        {flights.map((destination) => (
          <Destino key={destination.destination} destination={destination} 
          onSeleccionarVuelo={(vuelo) => setVueloSeleccionado(vuelo)}
          />
        ))}
         {/* Panel de detalles del vuelo seleccionado */}
         {vueloSeleccionado && (
          <PanelDetalleVuelo vuelo={vueloSeleccionado} />
        )}
      </main>
    </div>
  );
}

function Destino({ destination }) {
  return (
    <div className="destino">
      <h2>Destino: {destination.destination}</h2>
      <ul>
        {destination.flights.map((flights) => (
          <li key={flights.id}>
            <strong>Vuelo:</strong> {flights.number} - <strong>Fecha:</strong> {flights.date}
            <button
              onClick={() =>
                onSeleccionarVuelo({ ...flights, destino: destination.destination })
              }
            >
              Seleccionar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PanelDetalleVuelo({ flights }) {
  return (
    <div className="panel-detalle">
      <h3>Detalle del Vuelo</h3>
      <p><strong>Destino:</strong> {Destino.destination}</p>
      <p><strong>Fecha:</strong> {flights.date}</p>
      <p><strong>Hora:</strong> {flights.time}</p>
      <p><strong>Plazas Totales:</strong> {flights.plazasDisponibles + (flights.plazasOcupadas || 0)}</p>
      <p><strong>Plazas Disponibles:</strong> {flights.plazasDisponibles}</p>
      <p><strong>Plazas Ocupadas:</strong> {flights.plazasOcupadas || 0}</p>
    </div>
  );
}
export default App;
