import React from 'react';

const Navbar = () => {
    return (
        <nav style={styles.navbar}>
            <div style={styles.logo}>Электронная очередь</div>
            <ul style={styles.navLinks}>
                <li style={styles.navLink}>Очереди</li>
                <li style={styles.navLink}>О нас</li>
                <li style={styles.navLink}>Контакты</li>
            </ul>
        </nav>
    );
};

const styles = {
    navbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#333',
        color: '#fff',
        padding: '10px',
    },
    logo: {
        fontSize: '24px',
        fontWeight: 'bold',
    },
    navLinks: {
        listStyle: 'none',
        display: 'flex',
        margin: 0,
        padding: 0,
    },
    navLink: {
        marginLeft: '10px',
        cursor: 'pointer',
    },
};

export default Navbar;
