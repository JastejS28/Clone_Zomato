import React, { useEffect, useState } from 'react';
import FoodImageCarousel from "../components/FoodImageCarousel";
import Styles from "./RestaurantPageItem.module.css";
import FoodItem from '../components/FoodItem';

const RestaurantPageItem = ({ restaurant }) => {
    const [cuisineCategory, setCuisineCategory] = useState("");
    const [cuisineFood, setCuisineFood] = useState([]);

    useEffect(() => {
        const food = restaurant?.cusines?.filter(item => item.category === cuisineCategory)?.[0];
        if (food && Array.isArray(food.food)) {
            setCuisineFood(food.food);
        } else {
            setCuisineFood([]);
        }
    }, [cuisineCategory, restaurant]);

    const cuisineCategoryHandler = (category) => {
        setCuisineCategory(category);
    }

    if (!restaurant) {
        return <div>Loading restaurant data...</div>;
    }

    return (
        <div className={Styles['restaurant-page-container']}>

            <div className={Styles['carousel-section']}>
                 <FoodImageCarousel
                     address={restaurant.address}
                     imageUrl={restaurant.coverImage}
                     name={restaurant.name}
                     contact={restaurant.contact}
                 />
            </div>

            <div className={Styles['menu-section']}>
                <h4 className={Styles['cusines-heading']}>Select Your Delicious Cuisine</h4>

                <div className={Styles['cusines-layout']}>

                    <div className={Styles['cusines-category-list']}>
                        {Array.isArray(restaurant.cusines) && restaurant.cusines.map((item, indx) =>
                            item?.category && (
                                <div
                                    className={
                                        item.category === cuisineCategory
                                            ? `${Styles['active-category']} ${Styles['cusines-category-item']}`
                                            : Styles['cusines-category-item']
                                    }
                                    onClick={() => { cuisineCategoryHandler(item.category) }}
                                    key={item._id || indx}
                                >
                                    {item.category}
                                </div>
                            )
                        )}
                         {Array.isArray(restaurant.cusines) && restaurant.cusines.length === 0 && (
                             <div className={Styles['no-cuisines']}>No cuisines available for this restaurant.</div>
                         )}
                    </div>

                    <div className={Styles['cusines-food-list']}>
                        {Array.isArray(cuisineFood) && cuisineFood.length > 0 ? (
                            cuisineFood.map((item, indx) => (
                                item && (
                                    <FoodItem
                                        key={item._id || indx}
                                        food={item}
                                        category={cuisineCategory}
                                        restaurantName={restaurant.name}
                                    />
                                )
                            ))
                        ) : (
                            <div className='no-food-container'>
                            <div className={Styles['no-food-items']}>
                                {cuisineCategory ? `No food items found in ${cuisineCategory} category.` : 'Select a cuisine category to see food items.'}
                            </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RestaurantPageItem;
