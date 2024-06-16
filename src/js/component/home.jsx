import React, { useState, useEffect } from 'react';

const Home = () => {
  const [tareas, setTareas] = useState([]);
  const [valorInput, setValorInput] = useState('');

  useEffect(() => {
    // Fetch inicial para obtener las tareas
    fetchTareas();

    // Llamar la función para crear usuario solo si no existe
    verificarUsuario();
  }, []);

  const verificarUsuario = () => {
    fetch('https://playground.4geeks.com/todo/users/TulioPortela', {
      method: 'GET',
      headers: {
        'accept': 'application/json'
      }
    })
    .then(resp => {
      if (!resp.ok) {
        // Si el usuario no existe, crearlo
        return criarUsuario();
      }
      return resp.json();
    })
    .then(data => {
      console.log(data); 
    })
    .catch(error => {
      console.error('Error al verificar usuario:', error);
    });
  };

  const criarUsuario = () => {
    return fetch('https://playground.4geeks.com/apis/fake/todos/user', {
      method: 'POST',
      body: JSON.stringify({ username: 'TulioPortela' }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(resp => {
      if (!resp.ok) {
        throw new Error('Error al crear usuario');
      }
      return resp.json();
    })
    .then(data => {
      console.log(data);
      // Después de crear el usuario, obtener las tareas
      fetchTareas();
    })
    .catch(error => {
      console.error('Error al crear usuario:', error);
    });
  };

  const fetchTareas = () => {
    fetch('https://playground.4geeks.com/todo/users/TulioPortela', {
      method: 'GET',
      headers: {
        'accept': 'application/json'
      }
    })
    .then(resp => {
      if (!resp.ok) {
        throw new Error('Error al obtener tareas');
      }
      return resp.json();
    })
    .then(data => {
      console.log(data); // Para verificar el formato de la respuesta en la consola
      if (Array.isArray(data.todos)) { 
        setTareas(data.todos);
      } else {
        setTareas([]);
      }
    })
    .catch(error => {
      console.error('Error al obtener tareas:', error);
    });
  };

  const sincronizarTareas = (nuevasTareas) => {
    fetch('https://playground.4geeks.com/todo/users/TulioPortela', {
      method: 'PUT',
      body: JSON.stringify({ name: 'TulioPortela', todos: nuevasTareas }), 
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(resp => {
      if (!resp.ok) {
        throw new Error('Error al sincronizar tareas');
      }
      return resp.json();
    })
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('Error al sincronizar tareas:', error);
    });
  };

  const manejarCambioInput = (e) => {
    setValorInput(e.target.value);
  };

  const manejarPresionTecla = (e) => {
    if (e.key === 'Enter' && valorInput !== '') {
      adicionarTarefa();
    }
  };

  const adicionarTarefa = () => {
    if (valorInput !== '') {
      const nuevasTareas = [...tareas, { label: valorInput, is_done: false }];
      setTareas(nuevasTareas);
      setValorInput('');
      sincronizarTareas(nuevasTareas);
    }
  };

  const manejarEliminarTarea = (indice) => {
    const nuevasTareas = tareas.filter((_, i) => i !== indice);
    setTareas(nuevasTareas);
    sincronizarTareas(nuevasTareas);
  };

  const limparTarefas = () => {
    const nuevasTareas = [];
    setTareas(nuevasTareas);
    sincronizarTareas(nuevasTareas);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card w-50">
        <h2 className="card-header text-center">Lista de Tarefas</h2>
        <div className="card-body">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Adicionar tarefa"
              value={valorInput}
              onChange={manejarCambioInput}
              onKeyPress={manejarPresionTecla}
            />
            <button className="btn btn-primary" onClick={adicionarTarefa}>
              Adicionar
            </button>
          </div>
          {Array.isArray(tareas) && tareas.length === 0 ? (
            <p className="text-center text-muted">Sem Tarefas</p>
          ) : (
            <ul className="list-group mb-3">
              {tareas.map((tarefa, indice) => (
                <li key={indice} className="list-group-item d-flex justify-content-between align-items-center">
                  {tarefa.label}
                  <button className="btn btn-link" onClick={() => manejarEliminarTarefa(indice)}>
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
          {Array.isArray(tareas) && tareas.length > 0 && (
            <p className="text-center">
              {tareas.length} {tareas.length === 1 ? 'Tarefa' : 'Tarefas'}
            </p>
          )}
          {Array.isArray(tareas) && tareas.length > 0 && (
            <button className="btn btn-danger w-100" onClick={limparTarefas}>
              Limpar Todas as Tarefas
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
