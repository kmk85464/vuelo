// App.js
import React, { useState } from 'react';
import vuelosData from './vuelos.json'; // Ajusta la ruta según la ubicación del archivo

function App() {
  const [flights] = useState(vuelosData); // Inicializa el estado con los datos del JSON

  return (
    <div className="App">
      <header>
        <h1>Listado de Vuelos</h1>
      </header>
      <main>
        {flights.map((destination) => (
          <Destino key={destination.destination} destination={destination} />
        ))}
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
            <strong>Vuelo:</strong> {flights.id} - <strong>Fecha:</strong> {flights.date}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
