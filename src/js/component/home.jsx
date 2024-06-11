import React, { useState, useEffect } from 'react';

const Home = () => {
  const [tareas, setTareas] = useState([]);
  const [valorInput, setValorInput] = useState('');

  useEffect(() => {
    // Fetch inicial para obter as tarefas
    fetch('https://playground.4geeks.com/todo/users/TulioPortela', {
      method: 'GET',
      headers: {
        'accept': 'application/json'
      }
    })
    .then(resp => {
      if (!resp.ok) {
        
      }
      return resp.json();
    })
    .then(data => {
      console.log(data); // Para verificar o formato da resposta no console
      if (Array.isArray(data.todos)) { 
        setTareas(data.todos);
      } else {
        
      }
    })
  }, []);

  const criarUsuario = () => {
    fetch('https://playground.4geeks.com/todo/users', {
      method: 'POST',
      body: JSON.stringify({ name: 'TulioPortela' }), 
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(resp => {
      if (!resp.ok) {
        throw new Error();
      }
      return resp.json();
    })
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('Erro ao criar usuário:', error);
    });
  };

  const sincronizarTareas = (tareas) => {
    // Sincronizar tarefas com o servidor
    fetch('https://playground.4geeks.com/todo/users/TulioPortela', {
      method: 'PUT',
      body: JSON.stringify({ name: 'TulioPortela', todos: tareas }), 
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(resp => {
      if (!resp.ok) {
        throw new Error();
      }
      return resp.json();
    })
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('Erro ao sincronizar tarefas:', error);
    });
  };

  const manejarCambioInput = (e) => {
    setValorInput(e.target.value);
  };

  const manejarPresionTecla = (e) => {
    if (e.key === 'Enter' && valorInput !== '') {
      agregarTarea();
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
    const novasTarefas = [];
    setTarefas(novasTarefas);
    sincronizarTarefas(novasTarefas);
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
              {Array.isArray(tareas) && tareas.map((tarefa, indice) => (
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
