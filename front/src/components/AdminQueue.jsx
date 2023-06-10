import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminQueue = () => {
  const [queues, setQueues] = useState([]);
  const [selectedQueue, setSelectedQueue] = useState(null);
  const [items, setItems] = useState([]);
  const [newQueueName, setNewQueueName] = useState('');
  const [newMaxCapacity, setNewMaxCapacity] = useState(0);

  useEffect(() => {
    fetchQueues();
  }, []);

  const fetchQueues = async () => {
    try {
      const response = await axios.get('/queues');
      setQueues(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleQueueClick = async (queueId) => {
    try {
      const response = await axios.get(`/queues/${queueId}/items`);
      setItems(response.data);
      setSelectedQueue(queueId);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateQueue = async () => {
    try {
      const newQueue = {
        id: Date.now().toString(),
        name: newQueueName,
        max_capacity: parseInt(newMaxCapacity),
        is_public: true,
      };
      await axios.post('/queues', newQueue);
      setNewQueueName('');
      setNewMaxCapacity(0);
      fetchQueues();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteQueue = async (queueId) => {
    try {
      await axios.delete(`/queues/${queueId}`);
      fetchQueues();
      setItems([]);
      setSelectedQueue(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await axios.delete(`/queues/${selectedQueue}/items/${itemId}`);
      handleQueueClick(selectedQueue);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Admin Queue</h2>
      <div>
        <h3>Queues:</h3>
        <ul>
          {queues.map((queue) => (
            <li key={queue.id} onClick={() => handleQueueClick(queue.id)}>
              {queue.name}
            </li>
          ))}
        </ul>
        <div>
          <h4>Create New Queue:</h4>
          <input
            type="text"
            placeholder="Queue Name"
            value={newQueueName}
            onChange={(e) => setNewQueueName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max Capacity"
            value={newMaxCapacity}
            onChange={(e) => setNewMaxCapacity(e.target.value)}
          />
          <button onClick={handleCreateQueue}>Create</button>
        </div>
      </div>
      {selectedQueue && (
        <div>
          <h3>Items in Queue:</h3>
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                {item.user_name}{' '}
                <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
              </li>
            ))}
          </ul>
          <button onClick={() => handleDeleteQueue(selectedQueue)}>
            Delete Queue
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminQueue;
