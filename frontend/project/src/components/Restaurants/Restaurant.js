import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import './Restaurants.css';

const Restaurant = ({ restaurant }) => {
    if (!restaurant) {
        return null;
    }

    return (
        <div className='restaurant-card-item'>
            <Card className='h-full flex flex-col'>
                <Card.Img
                    variant="top"
                    src={restaurant.coverImage}
                    className='restaurant-cover-image w-full object-cover'
                    alt={`Cover image for ${restaurant.name}`}
                    style={{ height: '180px' }}
                />
                <Card.Body className='flex flex-col justify-between flex-grow'>
                    <Card.Title className='capitalize text-lg font-semibold mb-2'>{restaurant.name}</Card.Title>
                    <hr className='my-2'/>
                    <Card.Text className='text-sm text-gray-600 mb-2'>
                        <span>Cuisines Available</span> <br/>
                        {Array.isArray(restaurant.cusines) && restaurant.cusines.map((c, index) => {
                            if (!c || !c.category) return null;
                            return (
                                <span key={c._id || index} className='capitalize text-xs mr-1'>{c.category}</span>
                            );
                        })}
                    </Card.Text>
                    <hr className='my-2'/>
                    <Button
                        variant="primary"
                        as={Link}
                        to={`/app/${restaurant._id}`}
                        className='w-full mt-auto bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded'
                    >
                        Details
                    </Button>
                </Card.Body>
            </Card>
        </div>
    );
}

export default Restaurant;
