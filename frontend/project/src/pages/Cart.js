import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ListGroup } from 'react-bootstrap';
import CartItem from '../components/Cart/CartItem';
import axios from "../utils/axios";
import { useNavigate } from 'react-router-dom';

import Styles from './Cart.module.css';

function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
}

const Cart = () => {
    const dispatch = useDispatch();
    const { user, cart } = useSelector(state => state.userReducer);
    const navigate = useNavigate();

    let totalPrice = 0;
    if (Array.isArray(cart)) {
        cart.forEach((item) => {
            if (item && item.food && typeof item.food.price === 'number' && typeof item.quantity === 'number' && item.restaurant_name && item.category) {
                totalPrice += item.food.price * item.quantity;
            }
        });
    }

    const handleCheckout = async () => {
        if (!Array.isArray(cart) || cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }
        if (totalPrice <= 0) {
            alert("Cart total is invalid.");
            return;
        }

        try {
            const { data: { order_id, amount, currency } } = await axios.post('/api/payment/create-order');

            const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

            if (!res) {
                alert('Razorpay SDK failed to load. Are you online?');
                return;
            }

            const options = {
                key: process.env.REACT_APP_RAZORPAY_TEST_KEY_ID,
                amount: amount,
                currency: currency,
                order_id: order_id,
                name: 'Your Zomato Clone',
                description: 'Payment for food order',
                image: 'YOUR_LOGO_URL',
                prefill: {
                    name: user?.name || '',
                    email: user?.email || '',
                },
                notes: {
                    address: "Zomato Clone Order"
                },
                theme: {
                    color: '#FF4466'
                },
                handler: async function (response) {
                    const {
                        razorpay_order_id,
                        razorpay_payment_id,
                        razorpay_signature,
                    } = response;

                    try {
                        const { data } = await axios.post('/api/payment/verify', {
                            razorpay_order_id,
                            razorpay_payment_id,
                            razorpay_signature,
                        });

                        if (data.success) {
                            alert("Payment Successful!");
                            dispatch({ type: 'SET_CART', payload: [] });
                            navigate('/order-history');
                        } else {
                            alert("Payment verification failed.");
                        }

                    } catch (error) {
                        const errorMessage = error.response?.data?.message || "Payment verification failed. Please contact support.";
                        alert(errorMessage);
                    }
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

            rzp.on('payment.failed', function (response) {
                alert("Payment failed: " + response.error.description);
            });

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to initiate checkout. Please try again.";
            alert(errorMessage);
        }
    };

    return (
        <div className={Styles['cart-container']}>
            <h2 className={Styles['cart-title']}>Your Cart</h2>

            <div className={Styles['cart-items-list']}>
                 {(!cart || cart.length === 0) && (
                     <div className={Styles['empty-cart-message']}>Your cart is empty.</div>
                 )}
                 {Array.isArray(cart) && cart.length > 0 && (
                     <ListGroup className={Styles['bootstrap-list-group']}>
                         {cart.map((cartItem) => (
                             <CartItem key={cartItem._id || cartItem.food?._id} data={cartItem} />
                         ))}
                     </ListGroup>
                 )}
            </div>

            {Array.isArray(cart) && cart.length > 0 && (
                 <div className={Styles['cart-summary']}>
                     <div className={Styles['cart-total']}>
                         <h4>Total Price: ₹{totalPrice.toFixed(2)}</h4>
                     </div>
                     <button className={Styles['buy-now-btn']} onClick={handleCheckout}>
                         Proceed to Checkout
                     </button>
                 </div>
            )}
        </div>
    );
};

export default Cart;
