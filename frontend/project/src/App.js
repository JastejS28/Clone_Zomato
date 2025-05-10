import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Home from './pages/Home';
import Cart from './pages/Cart.js';
import RestaurantPage from './pages/RestaurantPage';
import StartPage from './pages/StartPage.js';
import Navbar from './components/Navbar.js';
import SignupPage from './pages/SignupPage.js';
import OwnerMain from './components/Owner/OwnerMain.js';
import AddRestaurantForm from './components/Owner/Add/AddRestaurantForm.js';
import OrderHistory from './pages/OrderHistory.js';

function App() {
  const location = useLocation();
  
  const hideNavbarRoutes = ['/', '/login', '/signup'];
  
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="App">
      {shouldShowNavbar && <Navbar />}
      
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/app' element={<Home />} />
        <Route path='/cart' element={<Cart />} />

        <Route path='/restaurant' element={<OwnerMain />} />
        <Route path='/restaurant/register' element={<AddRestaurantForm />} />
        <Route path='app/:restaurant_id' element={<RestaurantPage />} />
        <Route path='/order-history' element={<OrderHistory />} />
      </Routes>
    </div>
  );
}

export default App;
