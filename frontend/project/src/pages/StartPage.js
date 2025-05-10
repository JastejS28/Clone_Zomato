import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Carousel } from "react-bootstrap";
import Login from "./Login";
import SignupPage from "./SignupPage";
import { useNavigate } from "react-router-dom";


const images = [
  "https://img.freepik.com/free-photo/pizza-with-sausages-tomato-cheese-olives-pepper_141793-17550.jpg?t=st=1743531184~exp=1743534784~hmac=9da8c3dda1bcca213d6a7a35189e29c8bec95a18e6ff4feae71915f5cc749ba6&w=1380",
  "https://www.simplyrecipes.com/thmb/H3j9svznweYmxrfrfAW34jG280Q=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Copycat-Subway-Chocolate-Chip-Cookies--8-a40444af559346edb461ff762eb7dabc.jpg",
  "https://food.annapurnaderoyal.com/wp-content/uploads/2021/07/Veg-Hakka-Noodles.jpg",
];

export default function StartPage() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();


  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  return (
    <div className="position-relative">
      <Carousel 
        activeIndex={index} 
        onSelect={() => {}} 
        indicators={false} 
        controls={false}
        className="zomato-carousel"
      >
        {images.map((src, i) => (
          <Carousel.Item key={i}>
            <motion.div
              className="carousel-image-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={src}
                alt={`Food slide ${i + 1}`}
                className="w-100 carousel-image"
              />
              <div className="image-overlay"></div>
            </motion.div>
          </Carousel.Item>
        ))}
      </Carousel>

      <div className="text-overlay d-flex flex-column align-items-center justify-content-center">
        <motion.h1 
          className="main-title text-white font-weight-bold text-center mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          zomato
        </motion.h1>
        <motion.h2 
          className="subtitle text-white text-center mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          India's #1<br />food delivery app
        </motion.h2>
        <motion.p 
          className="description text-white text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Experience fast & easy online ordering<br />on the Zomato app
        </motion.p>

        <motion.div 
          className="d-flex app-buttons"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
         
        </motion.div>

        <motion.div 
          className="auth-buttons mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.8 }}
        >
          <button className="login-btn me-3" onClick={handleLogin}>Login</button>
          <button className="signup-btn" onClick={handleSignup}>Signup</button>
        </motion.div>
      </div>
  
      <style jsx>{`
        .carousel-image-container {
          height: 100vh;
          width: 100%;
          position: relative;
        }
        
        .carousel-image {
          height: 100vh;
          object-fit: cover;
        }
        
        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
        }
        
        .text-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 10;
        }
        
        .main-title {
          font-size: 4rem;
          font-weight: 700;
        }
        
        .subtitle {
          font-size: 3rem;
          font-weight: 700;
        }
        
        .description {
          font-size: 1.25rem;
        }
        
        .download-btn {
          height: 50px;
          transition: transform 0.3s ease;
        }
        
        .download-btn:hover {
          transform: scale(1.05);
        }
        
        .auth-buttons {
          display: flex;
          justify-content: center;
        }
        
        .login-btn, .signup-btn {
          padding: 10px 25px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .login-btn {
          background-color: #EF4F5F;
          color: white;
          border: 2px solid #EF4F5F;
        }
        
        .signup-btn {
          background-color: transparent;
          color: white;
          border: 2px solid white;
        }
        
        .login-btn:hover, .signup-btn:hover {
          transform: scale(1.05);
        }
        
        @media (max-width: 768px) {
          .main-title {
            font-size: 3rem;
          }
          
          .subtitle {
            font-size: 2rem;
          }
          
          .description {
            font-size: 1rem;
          }
          
          .download-btn {
            height: 40px;
          }
          
          .login-btn, .signup-btn {
            padding: 8px 20px;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}