import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AdminPanel = () => {
  const [adminCredentials, setAdminCredentials] = useState({
    username: '',
    password: ''
  });

  const [newQueue, setNewQueue] = useState({
    id: uuidv4(),
    name: '',
    max_capacity: 0,
    is_public: true
  });

  const handleAdminCredentialsChange = (event) => {
    setAdminCredentials({
      ...adminCredentials,
      [event.target.name]: event.target.value
    });
  };

  const handleNewQueueChange = (event) => {
    setNewQueue({
      ...newQueue,
      [event.target.name]: event.target.value
    });
  };

  const handleDeleteQueue = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8080/queues/${newQueue.id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(adminCredentials)
      });

      if (response.ok) {
        console.log('Очередь успешно удалена');
        // Выполните здесь любую другую логику после успешного удаления очереди
      } else {
        console.log('Ошибка при удалении очереди:', response.statusText);
      }
    } catch (error) {
      console.log('Ошибка при выполнении запроса:', error);
    }
  };

  const handleCreateQueue = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8080/queues', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          queue: newQueue,
          credentials: adminCredentials
        })
      });

      if (response.ok) {
        console.log('Очередь успешно создана');
        // Выполните здесь любую другую логику после успешного создания очереди
      } else {
        console.log('Ошибка при создании очереди:', response.statusText);
      }
    } catch (error) {
      console.log('Ошибка при выполнении запроса:', error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.authBlock}>
        <h2 style={styles.heading}>Аутентификация</h2>
        <div>
          <label htmlFor="adminUsername" style={styles.label}>
            Имя пользователя:
          </label>
          <input
            type="text"
            id="adminUsername"
            value={adminCredentials.username}
            onChange={handleAdminCredentialsChange}
            name="username"
            style={styles.input}
          />
        </div>
        <div>
          <label htmlFor="adminPassword" style={styles.label}>
            Пароль:
          </label>
          <input
            type="password"
            id="adminPassword"
            value={adminCredentials.password}
            onChange={handleAdminCredentialsChange}
            name="password"
            style={styles.input}
          />
        </div>
      </div>
      <div style={styles.queueBlock}>
        <h2 style={styles.heading}>Управление очередями</h2>
        <div>
          <label htmlFor="newQueueName" style={styles.label}>
            Название очереди:
          </label>
          <input
            type="text"
            id="newQueueName"
            value={newQueue.name}
            onChange={handleNewQueueChange}
            name="name"
            style={styles.input}
          />
        </div>
        <div>
          <label htmlFor="newQueueMaxCapacity" style={styles.label}>
            Максимальная вместимость:
          </label>
          <input
            type="number"
            id="newQueueMaxCapacity"
            value={newQueue.max_capacity}
            onChange={handleNewQueueChange}
            name="max_capacity"
            style={styles.input}
          />
        </div>
        <div>
          <label htmlFor="newQueueIsPublic" style={styles.label}>
            Публичная очередь:
          </label>
          <input
            type="checkbox"
            id="newQueueIsPublic"
            checked={newQueue.is_public}
            onChange={handleNewQueueChange}
            name="is_public"
            style={styles.input}
          />
        </div>
        <button onClick={handleCreateQueue} style={styles.button}>
          Создать очередь
        </button>
        <div style={styles.deleteQueueBlock}>
          <label htmlFor="queueIdToDelete" style={styles.label}>
            ID очереди для удаления:
          </label>
          <input
            type="text"
            id="queueIdToDelete"
            value={newQueue.id}
            onChange={handleNewQueueChange}
            name="id"
            style={styles.input}
          />
          <button onClick={handleDeleteQueue} style={styles.button}>
            Удалить очередь
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '400px',
    margin: '0 auto',
    textAlign: 'center'
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '16px'
  },
  label: {
    display: 'block',
    marginBottom: '8px'
  },
  input: {
    width: '100%',
    padding: '8px',
    marginBottom: '16px'
  },
  button: {
    padding: '8px 16px',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    background: 'blue',
    transition: 'background 0.3s ease',
    marginBottom: '16px',
  },
  authBlock: {
    marginBottom: '32px'
  },
  queueBlock: {
    marginTop: '32px'
  },
  deleteQueueBlock: {
    marginTop: '24px'
  }
};

export default AdminPanel;
