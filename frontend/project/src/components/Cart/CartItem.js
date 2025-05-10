import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { useDispatch } from 'react-redux';
import axios from "../../utils/axios";

const CartItem = ({ data }) => {
    const { food, quantity, restaurant_name, category } = data;
    const dispatch = useDispatch();

    if (!data || !food || !food._id || !food.name || typeof food.price !== 'number' || !restaurant_name || !category) {
        console.error("Invalid or incomplete cart item data:", data);
        return <ListGroup.Item className="text-danger">Error loading item data.</ListGroup.Item>;
    }

    const foodId = food._id;

    const increaseQuantityHandler = async () => {
        try {
            const { data } = await axios.get(`/restaurant/increase-cart/${foodId}?restaurant_name=${restaurant_name}&category=${category}`);
            console.log("Increase Cart Response Data:", data);

            if (data && Array.isArray(data.data)) {
                dispatch({
                    type: 'SET_CART',
                    payload: data.data
                });
                console.log("Cart state updated in Redux store after increase.");
            } else {
                console.warn("API call successful, but response did not contain a valid 'data' array to update cart state after increase.", data);
            }
        } catch (error) {
            console.error("Error increasing item quantity:", error);
            alert("Failed to increase item quantity. Please try again.");
        }
    };

    const decreaseQuantityHandler = async () => {
        try {
            const { data } = await axios.get(`/restaurant/decrease-cart/${foodId}?restaurant_name=${restaurant_name}&category=${category}`);
            console.log("Decrease Cart Response Data:", data);

            if (data && Array.isArray(data.data)) {
                dispatch({
                    type: 'SET_CART',
                    payload: data.data
                });
                console.log("Cart state updated in Redux store after decrease.");
            } else {
                console.warn("API call successful, but response did not contain a valid 'data' array to update cart state after decrease.", data);
            }
        } catch (error) {
            console.error("Error decreasing item quantity:", error);
            alert("Failed to decrease item quantity. Please try again.");
        }
    };

    const deleteItemHandler = async () => {
        try {
            const { data } = await axios.get(`/restaurant/delete-cart-item/${foodId}?restaurant_name=${restaurant_name}&category=${category}`);
            console.log("Delete Cart Response Data:", data);

            if (data && Array.isArray(data.data)) {
                dispatch({
                    type: 'SET_CART',
                    payload: data.data
                });
                console.log("Cart state updated in Redux store after deletion.");
            } else {
                console.warn("API call successful, but response did not contain a valid 'data' array to update cart state after deletion.", data);
            }
        } catch (error) {
            console.error("Error deleting item:", error);
            alert("Failed to delete item. Please try again.");
        }
    };

    return (
        <ListGroup.Item className="d-flex justify-content-between align-items-center cart-item">
            <div>
                <div className="fw-bold">{food.name}</div>
                <div>Price: ₹{food.price.toFixed(2)}</div>
                <div>Item Total: ₹{(food.price * quantity).toFixed(2)}</div>
            </div>

            <div className="d-flex align-items-center">
                <button
                    className="btn btn-sm btn-secondary me-1"
                    onClick={decreaseQuantityHandler}
                >
                    -
                </button>
                <span className="mx-1">{quantity}</span>
                <button
                    className="btn btn-sm btn-secondary ms-1"
                    onClick={increaseQuantityHandler}
                >
                    +
                </button>
                <button
                    className="btn btn-sm btn-danger ms-3"
                    onClick={deleteItemHandler}
                >
                    Remove
                </button>
            </div>
        </ListGroup.Item>
    );
};

export default CartItem;
