import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Styles from './Navbar.module.css';
import { useDispatch, useSelector } from 'react-redux';
import ProfileImage from './ProfileImage';
import axios from '../utils/axios.js';

const Navbar = () => {
    const userData = useSelector(state => state.userReducer);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const isLoggedIn = async () => {
            try {
                const { data } = await axios.get('/getuser');
                if (data.user) {
                    dispatch({ type: 'SET_USER', payload: data.user });
                }
            } catch (error) {
                console.error("Error checking login status in Navbar:", error);
            }
        }
        isLoggedIn();
    }, [dispatch]);

    const handleLogout = async () => {
        try {
            const { data } = await axios.post('/logout');
            if (data.success) {
                navigate('/');
                alert("You have been logged out.");
            } else {
                console.error("Logout reported success: false", data);
                alert("Logout failed. Please try again.");
            }
        } catch (error) {
            console.error("Error during logout:", error);
            const errorMessage = error.response?.data?.message || "Failed to logout. Please try again.";
            alert(errorMessage);
        }
    };

    return (
        <div className={Styles['navbar']}>
            <img className={Styles['logo']} src='https://imgs.search.brave.com/83xtiYyGd97s6alBrayyKlVM6Y1vRl49VjyR7P8hDRI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/Zmx1aWRzY2FwZXMu/aW4vd3AtY29udGVu/dC91cGxvYWRzLzIw/MjMvMDUvem9tYXRv/LWxvZ28tZnVsbC5q/cGc' alt="Zomato Clone Logo"></img>

            <div className={Styles['nav-links']}>
                {!userData.isLoggedIn && <NavLink className={Styles['nav-item']} to="/login">Login</NavLink>}
                {!userData.isLoggedIn && <NavLink className={Styles['nav-item']} to="/signup">Signup</NavLink>}
                {userData.isLoggedIn && <NavLink className={Styles['nav-item']} to="/app">Home</NavLink>}
                {userData.isLoggedIn && <NavLink className={Styles['nav-item']} to="/restaurant">Restaurants</NavLink>}
                {userData.isLoggedIn && (
                     <NavLink className={`${Styles['nav-item']} ${Styles['cart-link']}`} to="/cart"> 
                         <span className={Styles['cart-heading']}>
                             Cart
                             <span className={Styles['cart-number']}>{userData?.cart?.length || 0}</span> 
                         </span>
                     </NavLink>
                )}
                {userData.isLoggedIn && <NavLink className={Styles['nav-item']} to="/order-history">History</NavLink>} 
                {userData.isLoggedIn && (
                     <button className={`${Styles['nav-item']} ${Styles['logout-button']}`} onClick={handleLogout}>
                         Logout
                     </button>
                )}
                {userData.isLoggedIn && userData.image && <ProfileImage imageUrl={userData.image} />}
            </div>
        </div>
    )
}

export default Navbar;
