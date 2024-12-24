import React, { useState, useEffect } from 'react';
import vuelosData from './vuelos.json';

const App = () => {
  const [vuelos, setVuelos] = useState([]);
  const [vueloSeleccionado, setVueloSeleccionado] = useState(null);
  const [nuevoVuelo, setNuevoVuelo] = useState({ destination: '', number: '', date: '', time: '', seats: 0, available_seats: 0, occupied_seats: 0 });
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (Array.isArray(vuelosData)) {
      setVuelos(vuelosData);
    }
  }, []);

  useEffect(() => {
    const vueloConPocasPlazas = vuelos.flatMap(destino => destino.flights)
      .find(vuelo => vuelo.available_seats < 3);

    if (vueloConPocasPlazas) {
      setMensaje(`Últimas plazas disponibles para el vuelo ${vueloConPocasPlazas.number} con destino ${vueloConPocasPlazas.destination}`);
    } else {
      setMensaje('');
    }
  }, [vuelos]);

  const seleccionarVuelo = (vuelo, destino) => {
    setVueloSeleccionado({ ...vuelo, destination: destino });
  };

  const reservarPlaza = () => {
    if (vueloSeleccionado && vueloSeleccionado.available_seats > 0) {
      setVueloSeleccionado((prev) => ({
        ...prev,
        available_seats: prev.available_seats - 1,
        occupied_seats: prev.occupied_seats + 1
      }));

      // Actualizar el estado de los vuelos
      const updatedVuelos = vuelos.map((destino) => {
        if (destino.destination === vueloSeleccionado.destination) {
          return {
            ...destino,
            flights: destino.flights.map((vuelo) => {
              if (vuelo.number === vueloSeleccionado.number) {
                return {
                  ...vuelo,
                  available_seats: vuelo.available_seats - 1,
                  occupied_seats: vuelo.occupied_seats + 1
                };
              }
              return vuelo;
            })
          };
        }
        return destino;
      });

      setVuelos(updatedVuelos);
    }
  };

  const liberarPlaza = () => {
    if (vueloSeleccionado && vueloSeleccionado.occupied_seats > 0) {
      setVueloSeleccionado((prev) => ({
        ...prev,
        available_seats: prev.available_seats + 1,
        occupied_seats: prev.occupied_seats - 1
      }));

      // Actualizar el estado de los vuelos
      const updatedVuelos = vuelos.map((destino) => {
        if (destino.destination === vueloSeleccionado.destination) {
          return {
            ...destino,
            flights: destino.flights.map((vuelo) => {
              if (vuelo.number === vueloSeleccionado.number) {
                return {
                  ...vuelo,
                  available_seats: vuelo.available_seats + 1,
                  occupied_seats: vuelo.occupied_seats - 1
                };
              }
              return vuelo;
            })
          };
        }
        return destino;
      });

      setVuelos(updatedVuelos);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoVuelo((prev) => ({ ...prev, [name]: value }));
  };

  const añadirVuelo = (destino) => {
    const updatedVuelos = vuelos.map((d) => {
      if (d.destination === destino) {
        return {
          ...d,
          flights: [
            ...d.flights,
            {
              ...nuevoVuelo,
              destination: destino,
              available_seats: nuevoVuelo.seats,
              occupied_seats: 0
            }
          ]
        };
      }
      return d;
    });
    setVuelos(updatedVuelos);
    setNuevoVuelo({ destination: '', number: '', date: '', time: '', seats: 0, available_seats: 0, occupied_seats: 0 });
  };

  const eliminarVuelo = (vueloNumero, destino) => {
    const updatedVuelos = vuelos.map((d) => {
      if (d.destination === destino) {
        return {
          ...d,
          flights: d.flights.filter((vuelo) => vuelo.number !== vueloNumero)
        };
      }
      return d;
    });
    setVuelos(updatedVuelos);
    if (vueloSeleccionado && vueloSeleccionado.number === vueloNumero) {
      setVueloSeleccionado(null);
    }
  };

  return (
    <div>
      <h1>Listado de Vuelos</h1>
      {mensaje && <div className="header-message">{mensaje}</div>}
      {vuelos.length > 0 ? (
        vuelos.map((destino, index) => (
          <div key={index}>
            <h2>{destino.destination}</h2>
            <ul>
              {destino.flights.map((vuelo, index) => (
                <li key={index}>
                  {vuelo.number} - {vuelo.date}
                  <button onClick={() => seleccionarVuelo(vuelo, destino.destination)}>Seleccionar</button>
                  <button onClick={() => eliminarVuelo(vuelo.number, destino.destination)}>Eliminar vuelo</button>
                </li>
              ))}
            </ul>
            <button onClick={() => añadirVuelo(destino.destination)}>Añadir vuelo</button>
          </div>
        ))
      ) : (
        <p>Cargando vuelos...</p>
      )}
      {vueloSeleccionado && (
        <div>
          <h3>Detalles del Vuelo</h3>
          <p>Destino: {vueloSeleccionado.destination}</p>
          <p>Fecha: {vueloSeleccionado.date}</p>
          <p>Hora: {vueloSeleccionado.time}</p>
          <p>Plazas: {vueloSeleccionado.seats}</p>
          <p>Plazas disponibles: {vueloSeleccionado.available_seats}</p>
          <p>Plazas ocupadas: {vueloSeleccionado.occupied_seats}</p>
          <button onClick={reservarPlaza} disabled={vueloSeleccionado.available_seats === 0}>
            Reservar plaza
          </button>
          <button onClick={liberarPlaza} disabled={vueloSeleccionado.occupied_seats === 0}>
            Liberar plaza
          </button>
        </div>
      )}
      <div>
        <h3>Añadir Nuevo Vuelo</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            añadirVuelo(nuevoVuelo.destination);
          }}
        >
          <label>
            Destino:
            <select name="destination" value={nuevoVuelo.destination} onChange={handleInputChange}>
              <option value="">Seleccione un destino</option>
              {vuelos.map((destino, index) => (
                <option key={index} value={destino.destination}>
                  {destino.destination}
                </option>
              ))}
            </select>
          </label>
          <label>
            Número de Vuelo:
            <input type="text" name="number" value={nuevoVuelo.number} onChange={handleInputChange} />
          </label>
          <label>
            Fecha:
            <input type="date" name="date" value={nuevoVuelo.date} onChange={handleInputChange} />
          </label>
          <label>
            Hora:
            <input type="time" name="time" value={nuevoVuelo.time} onChange={handleInputChange} />
          </label>
          <label>
            Plazas:
            <input type="number" name="seats" value={nuevoVuelo.seats} onChange={handleInputChange} />
          </label>
          <button type="submit">Añadir vuelo</button>
        </form>
      </div>
    </div>
  );
};

export default App;
