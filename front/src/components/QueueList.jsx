import React, { useEffect, useState } from 'react';

const QueueList = () => {
    const [queues, setQueues] = useState([]);

    const fetchQueues = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8080/queues', {
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setQueues(data);
            } else {
                console.log('Ошибка при получении очередей:', response.statusText);
            }
        } catch (error) {
            console.log('Ошибка при выполнении запроса:', error);
        }
    };

    useEffect(() => {
        fetchQueues();

        const interval = setInterval(() => {
            fetchQueues();
        }, 5000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    const fetchQueueItems = async (queueId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8080/queues/${queueId}/items`, {
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                console.log('Ошибка при получении записей для очереди:', response.statusText);
                return [];
            }
        } catch (error) {
            console.log('Ошибка при выполнении запроса:', error);
            return [];
        }
    };

    const [queueItems, setQueueItems] = useState({});

    const fetchQueueItemsForAllQueues = async () => {
        const items = {};

        for (const queue of queues) {
            const data = await fetchQueueItems(queue.id);
            items[queue.id] = data;
        }

        setQueueItems(items);
    };

    useEffect(() => {
        fetchQueueItemsForAllQueues();
    }, [queues]);

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Список очередей</h2>
            {queues.map((queue) => (
                <div key={queue.id} style={styles.queueContainer}>
                    <h3 style={styles.queueName}>{queue.name}</h3>
                    <p style={styles.maxCapacity}>Максимальная вместимость: {queue.max_capacity}</p>
                    <table style={styles.queueTable}>
                        <thead>
                            <tr>
                                <th>Имя пользователя</th>
                            </tr>
                        </thead>
                        <tbody>
                            {queueItems[queue.id]?.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.user_name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
};

const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        maxWidth: '600px',
        margin: '0 auto',
    },
    heading: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '16px',
    },
    queueContainer: {
        marginBottom: '24px',
    },
    queueName: {
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '8px',
    },
    maxCapacity: {
        fontSize: '16px',
        marginBottom: '8px',
    },
    queueTable: {
        width: '100%',
        borderCollapse: 'collapse',
        border: '1px solid #ccc',
    },
    queueTable: {
        backgroundColor: '#f5f5f5',
        padding: '8px',
        textAlign: 'left',
        borderBottom: '1px solid #ccc',
    },
    queueTable: {
        padding: '8px',
        borderBottom: '1px solid #ccc',
    },
};

export default QueueList;
