import React from 'react';
import axios from "../utils/axios";
import { useDispatch } from 'react-redux';

const FoodItem = ({ food, category, restaurantName }) => {
    const dispatch = useDispatch();

    const addToCartHandler = async (id, category, restaurantName) => {
        try {
            const { data } = await axios.get(`/restaurant/add-cart/${id}?category=${category}&restaurant_name=${restaurantName}`);
            if (data && Array.isArray(data.data)) {
                dispatch({
                    type: 'SET_CART',
                    payload: data.data
                });
            } else {
                 console.warn("API call successful, but response did not contain an array 'data' to update cart state directly.", data);
            }

        } catch (error) {
            console.error("Error adding item to cart:", error);
            alert("Failed to add item to cart. Please try again.");
        }
    }

    return (
        <div className='food-item-container'>
            <div className='food-item-image'>
                <img src={food?.images[0]?.url} alt="food-item-image" />
            </div>
            <div className='food-item-details'>
                <div className='food-item-name'>{food.name}</div>
                <div className='food-item-price'>{food.price}</div>
                <div className='food-item-description'>{food.description}</div>
                <button className='add-to-cart-btn'
                    onClick={() => addToCartHandler(food._id, category, restaurantName)}>
                    Add To Cart
                </button>
            </div>
        </div>
    )
}

export default FoodItem;
