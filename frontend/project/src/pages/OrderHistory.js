import React, { useEffect, useState } from 'react';
import { ListGroup, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios.js';
import Styles from './OrderHistory.module.css';

const OrderHistory = () => {
    const [orderHistory, setOrderHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrderHistory = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get('/order-history');

                if (response.data.success) {
                    setOrderHistory(response.data.orderHistory);
                    console.log("Fetched order history:", response.data.orderHistory);
                } else {
                    console.error("Fetching order history reported success: false", response.data);
                    setError("Failed to fetch order history.");
                }
            } catch (error) {
                console.error("Error fetching order history:", error);
                if (error.response && error.response.status === 401) {
                    console.log("User not authenticated, redirecting to login.");
                    navigate('/login');
                } else {
                    setError(error.response?.data?.message || "Failed to fetch order history.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchOrderHistory();
    }, [navigate]);

    if (loading) {
        return (
             <div className={`${Styles['order-history-container']} text-center`}>
                 <p>Loading order history...</p>
             </div>
        );
    }

    if (error) {
        return (
             <div className={Styles['order-history-container']}>
                 <h2 className={Styles['order-history-title']}>Order History</h2>
                 <Alert variant="danger">{error}</Alert>
             </div>
        );
    }

    if (!Array.isArray(orderHistory) || orderHistory.length === 0) {
        return (
            <div className={Styles['order-history-container']}>
                <h2 className={Styles['order-history-title']}>Order History</h2>
                <div className={Styles['empty-history-message']}>You have no past orders.</div>
            </div>
        );
    }

    return (
        <div className={Styles['order-history-container']}>
            <h2 className={Styles['order-history-title']}>Order History</h2>

            <ListGroup className={Styles['order-list-group']}>
                {orderHistory.map((order, index) => (
                    <ListGroup.Item key={order._id || index} className={`mb-3 ${Styles['order-list-item']}`}>
                        <Card className={Styles['order-card']}>
                            <Card.Body className={Styles['order-card-body']}>
                                <Card.Title className={Styles['order-card-title']}>Order #{order._id ? order._id.slice(-6) : index + 1}</Card.Title>
                                <Card.Subtitle className={`${Styles['order-card-subtitle']} mb-2 text-muted`}>
                                    Date: {new Date(order.createdAt || order.date).toLocaleString()}
                                </Card.Subtitle>

                                {order.totalAmount !== undefined && (
                                     <Card.Text className={Styles['order-total-amount']}>
                                         <strong>Total Amount:</strong> ₹{order.totalAmount ? order.totalAmount.toFixed(2) : 'N/A'}
                                     </Card.Text>
                                )}

                                <h6 className={Styles['items-heading']}>Items:</h6>
                                <ListGroup variant="flush" className={Styles['item-list-group']}>
                                    {Array.isArray(order.items) && order.items.map((item, itemIndex) => (
                                        <ListGroup.Item key={item._id || itemIndex} className={Styles['item-list-item']}>
                                            {item.name && item.quantity !== undefined ? (
                                                <>
                                                    <span className={Styles['item-name']}>{item.name}</span>
                                                    <span className={Styles['item-quantity']}> x {item.quantity}</span>
                                                    <span className={Styles['item-price']}> - ₹{
                                                        typeof item.price === 'number' && item.quantity !== undefined ? 
                                                        (item.price * item.quantity).toFixed(2) : 'N/A'
                                                    }</span>
                                                </>
                                            ) : (
                                                'Invalid item data'
                                            )}
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
};

export default OrderHistory;
