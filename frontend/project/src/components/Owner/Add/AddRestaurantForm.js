import React, { useState, useRef, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import axios from "../../../utils/axios";
import './RestaurantSetup.css';

function RestaurantSetup() {
    const navigate = useNavigate();

    const submitHandler = () => {
        navigate('/restaurant');
    };
    const [currentStep, setCurrentStep] = useState(1);

    const [restaurantName, setRestaurantName] = useState('');
    const [address, setAddress] = useState('');
    const [contact, setContact] = useState('');
    const [coverImage, setCoverImage] = useState(null);
    const [isAddingRestaurant, setIsAddingRestaurant] = useState(false);
    const [restaurantError, setRestaurantError] = useState('');
    const [restaurantSuccess, setRestaurantSuccess] = useState('');
    const restaurantFileRef = useRef(null);

    const [addedRestaurantData, setAddedRestaurantData] = useState(null);
    const [categoryInput, setCategoryInput] = useState('');
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [categoryError, setCategoryError] = useState('');
    const [categorySuccess, setCategorySuccess] = useState('');

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [foodName, setFoodName] = useState('');
    const [foodPrice, setFoodPrice] = useState('');
    const [foodVeg, setFoodVeg] = useState(true);
    const [foodDescription, setFoodDescription] = useState('');
    const [foodImage, setFoodImage] = useState(null);
    const [isAddingFoodItem, setIsAddingFoodItem] = useState(false);
    const [foodItemError, setFoodItemError] = useState('');
    const [foodItemSuccess, setFoodItemSuccess] = useState('');
    const foodItemFileRef = useRef(null);

    useEffect(() => {
        if (currentStep === 3) {
           console.log("Selected category state is now:", selectedCategory);
        }
    }, [selectedCategory, currentStep]);

    const handleFileChange = (e, setter) => {
        setter(e.target.files[0]);
    };

    const handleRestaurantSubmit = async (e) => {
        e.preventDefault();
        setRestaurantError(''); setRestaurantSuccess('');
        if (!restaurantName || !address || !contact || !coverImage) {
            setRestaurantError('Please fill in all fields and upload a cover image.'); return;
        }
        setIsAddingRestaurant(true);
        const formData = new FormData();
        formData.append('name', restaurantName);
        formData.append('address', address);
        formData.append('contact', contact);
        formData.append('coverImage', coverImage);
        try {
            const response = await axios.post('/restaurant/register', formData);
            setRestaurantSuccess(`Restaurant "${response.data.data.name}" added successfully! Proceed to add categories.`);
            setAddedRestaurantData(response.data.data);
            setCurrentStep(2);
            setRestaurantName(''); setAddress(''); setContact(''); setCoverImage(null);
            if (restaurantFileRef.current) restaurantFileRef.current.value = "";
        } catch (err) {
            console.error("Add Restaurant Error:", err);
            setRestaurantError(err.response?.data?.message || 'Failed to add restaurant.');
        } finally { setIsAddingRestaurant(false); }
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        setCategoryError(''); setCategorySuccess('');
        if (!categoryInput.trim()) {
            setCategoryError('Please enter categories (comma-separated).'); return;
        }
        if (!addedRestaurantData) {
             setCategoryError('Restaurant data is missing.'); return;
        }
        setIsAddingCategory(true);
        try {
            const response = await axios.post('/restaurant/cusine-category-add', {
                categories: categoryInput, restaurant_name: addedRestaurantData.name
            });
            setCategorySuccess('Categories added successfully! Proceed to add food items.');
            setAddedRestaurantData(response.data.data);
            const fetchedCategories = response.data.data.cusines.map(c => c.category);
            console.log("Fetched categories for dropdown:", fetchedCategories);
            setCategories(fetchedCategories);
            if (fetchedCategories.length > 0) {
                setSelectedCategory(fetchedCategories[0]);
                console.log("Initial selected category set to:", fetchedCategories[0]);
            } else {
                 setSelectedCategory('');
            }
            setCurrentStep(3);
            setCategoryInput('');
        } catch (err) {
            console.error("Add Category Error:", err);
            setCategoryError(err.response?.data?.message || 'Failed to add categories.');
        } finally { setIsAddingCategory(false); }
    };

    const handleFoodItemSubmit = async (e) => {
        e.preventDefault();
        setFoodItemError(''); setFoodItemSuccess('');
        console.log(`Submitting food item with selected category: "${selectedCategory}"`);
        if (!selectedCategory || !foodName || !foodPrice || !foodDescription || !foodImage) {
            setFoodItemError('Please select a category, fill all fields, and upload image.'); return;
        }
        if (!addedRestaurantData) {
             setFoodItemError('Restaurant data is missing.'); return;
        }
        setIsAddingFoodItem(true);
        const formData = new FormData();
        formData.append('category', selectedCategory);
        formData.append('name', foodName);
        formData.append('price', foodPrice);
        formData.append('veg', String(foodVeg));
        formData.append('restaurant_name', addedRestaurantData.name);
        formData.append('description', foodDescription);
        formData.append('image', foodImage);
        try {
            const response = await axios.post('/restaurant/add-food-item', formData);
            setFoodItemSuccess(`Food item "${foodName}" added to category "${selectedCategory}"!`);
            setFoodName(''); setFoodPrice(''); setFoodVeg(true);
            setFoodDescription(''); setFoodImage(null);
            if (foodItemFileRef.current) foodItemFileRef.current.value = "";
        } catch (err) {
            console.error("Add Food Item Error:", err);
            console.error("Backend error data:", err.response?.data);
            setFoodItemError(err.response?.data?.message || 'Failed to add food item.');
        } finally { setIsAddingFoodItem(false); }
    };

    return (
        <div className="owner-setup-container">
            <h1>Restaurant Setup</h1>
            {currentStep === 1 && (
                <section className="setup-step">
                    <h2>Step 1: Add Restaurant Details</h2>
                    <form onSubmit={handleRestaurantSubmit} className="owner-form">
                        {restaurantError && <p className="error-message">{restaurantError}</p>}
                        {restaurantSuccess && <p className="success-message">{restaurantSuccess}</p>}
                        <div><label htmlFor="res-name">Name:</label><input type="text" id="res-name" value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} required /></div>
                        <div><label htmlFor="res-address">Address:</label><input type="text" id="res-address" value={address} onChange={(e) => setAddress(e.target.value)} required /></div>
                        <div><label htmlFor="res-contact">Contact:</label><input type="tel" id="res-contact" value={contact} onChange={(e) => setContact(e.target.value)} required /></div>
                        <div><label htmlFor="res-cover">Cover Image:</label><input type="file" id="res-cover" ref={restaurantFileRef} onChange={(e) => handleFileChange(e, setCoverImage)} accept="image/*" required /></div>
                        <button type="submit" disabled={isAddingRestaurant}>{isAddingRestaurant ? 'Adding...' : 'Add Restaurant & Proceed'}</button>
                    </form>
                </section>
            )}

            {currentStep === 2 && addedRestaurantData && (
                 <section className="setup-step">
                    <h2>Step 2: Add Categories for "{addedRestaurantData.name}"</h2>
                     <form onSubmit={handleCategorySubmit} className="owner-form">
                        {categoryError && <p className="error-message">{categoryError}</p>}
                        {categorySuccess && <p className="success-message">{categorySuccess}</p>}
                         <div><label htmlFor="res-categories">Categories (comma-separated):</label><input type="text" id="res-categories" value={categoryInput} onChange={(e) => setCategoryInput(e.target.value)} placeholder="e.g., Starters, Main Course" required /></div>
                         <button type="submit" disabled={isAddingCategory}>{isAddingCategory ? 'Adding...' : 'Add Categories & Proceed'}</button>
                     </form>
                 </section>
            )}

            {currentStep === 3 && addedRestaurantData && categories.length > 0 && (
                 <section className="setup-step">
                    <h2>Step 3: Add Food Items to "{addedRestaurantData.name}"</h2>
                    <form onSubmit={handleFoodItemSubmit} className="owner-form">
                        {foodItemError && <p className="error-message">{foodItemError}</p>}
                        {foodItemSuccess && <p className="success-message">{foodItemSuccess}</p>}

                        <div>
                            <label htmlFor="food-category">Category:</label>
                            <select
                                id="food-category"
                                value={selectedCategory}
                                onChange={(e) => {
                                    setSelectedCategory(e.target.value);
                                }}
                                required
                            >
                                <option value="" disabled={selectedCategory !== ''}>-- Select Category --</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>
                                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div><label htmlFor="food-name">Name:</label><input type="text" id="food-name" value={foodName} onChange={(e) => setFoodName(e.target.value)} required /></div>
                        <div><label htmlFor="food-price">Price:</label><input type="number" id="food-price" value={foodPrice} onChange={(e) => setFoodPrice(e.target.value)} min="0" step="0.01" required /></div>
                        <div><label>Type:</label><label style={{ display: 'inline-block', marginRight: '10px', fontWeight: 'normal'}}><input type="radio" name="veg" checked={foodVeg === true} onChange={() => setFoodVeg(true)} /> Veg </label><label style={{ display: 'inline-block', fontWeight: 'normal'}}><input type="radio" name="veg" checked={foodVeg === false} onChange={() => setFoodVeg(false)} /> Non-Veg </label></div>
                        <div><label htmlFor="food-desc">Description:</label><textarea id="food-desc" value={foodDescription} onChange={(e) => setFoodDescription(e.target.value)} required /></div>
                        <div><label htmlFor="food-image">Image:</label><input type="file" id="food-image" ref={foodItemFileRef} onChange={(e) => handleFileChange(e, setFoodImage)} accept="image/*" required /></div>

                        <button type="submit" disabled={isAddingFoodItem || !selectedCategory}>
                            {isAddingFoodItem ? 'Adding...' : 'Add Food Item'}
                        </button>
                    </form>
                    <span style={{marginTop: '20px'}}>Finished adding items?</span>
                    <button onClick={submitHandler} className='restaurant-finish-button'>Submit</button>
                 </section>
            )}

            {currentStep > 3 && (<p>Setup steps complete.</p>)}
        </div>
    );
}

export default RestaurantSetup;
