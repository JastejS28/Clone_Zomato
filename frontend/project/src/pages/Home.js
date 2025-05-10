import { useNavigate } from 'react-router-dom';
import React from 'react';

const Home = () => {
    const navigate = useNavigate();

    const handleOrderNow = () => {
        navigate("/restaurant");
    };

    const handleAddRestaurant = () => {
        navigate("/restaurant/register");
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Find the Best Food Near You</h1>
            <div style={styles.buttonContainer}>
                <button onClick={handleOrderNow} style={styles.orderButton}>
                    🛒 Order Now
                </button>
                <button onClick={handleAddRestaurant} style={styles.addRestaurantButton}>
                    🍴 Add Your Restaurant
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(to bottom, #FF7E8B, #FF5E6D)',
        color: '#fff',
        padding: '20px',
        textAlign: 'center',
    },
    title: {
        fontSize: '2.5em',
        marginBottom: '40px',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '100%',
        maxWidth: '400px',
        margin: '0 auto',
    },
    orderButton: {
        padding: '15px 25px',
        fontSize: '1.2em',
        fontWeight: 'bold',
        color: '#FF5E6D',
        backgroundColor: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    },
    addRestaurantButton: {
        padding: '15px 25px',
        fontSize: '1.2em',
        fontWeight: 'bold',
        color: '#fff',
        backgroundColor: '#FF5E6D',
        border: '2px solid #fff',
        borderRadius: '8px',
        cursor: 'pointer',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    },
};

export default Home;
