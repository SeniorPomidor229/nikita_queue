import React, { useState } from 'react';

const CancelRegistration = () => {
    const [registrationId, setRegistrationId] = useState('');

    const handleRegistrationIdChange = (event) => {
        setRegistrationId(event.target.value);
    };

    const handleCancelRegistration = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8080/queues/${registrationId}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                console.log('Запись на очередь успешно отменена');
            } else {
                console.log('Ошибка при отмене записи на очередь:', response.statusText);
            }
        } catch (error) {
            console.log('Ошибка при выполнении запроса:', error);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Отмена записи на очередь</h2>
            <div>
                <label htmlFor="registrationId" style={styles.label}>
                    ID записи на очередь:
                </label>
                <input
                    type="text"
                    id="registrationId"
                    value={registrationId}
                    onChange={handleRegistrationIdChange}
                    style={styles.input}
                />
            </div>
            <button onClick={handleCancelRegistration} style={styles.button}>
                Отменить запись
            </button>
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
    }
};

export default CancelRegistration;
