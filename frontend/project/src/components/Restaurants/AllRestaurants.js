import React from 'react';
import { useSelector } from 'react-redux';
import Restaurant from './Restaurant';
import './Restaurants.css'; 

const AllRestaurants = () => {
    const restaurantsData = useSelector(state => state.restaurantReducer);

    return (
        <div className='restaurants-grid'>
            {Array.isArray(restaurantsData) && restaurantsData.map((restaurant, index) =>
                <Restaurant key={restaurant._id || index} restaurant={restaurant} />
            )}
             {Array.isArray(restaurantsData) && restaurantsData.length === 0 && (
                 <div className="col-span-full text-center p-4">No restaurants found.</div>
             )}
        </div>
    );
}

export default AllRestaurants;
