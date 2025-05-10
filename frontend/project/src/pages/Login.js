import { useDispatch } from 'react-redux';
import axios from '../utils/axios.js';
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const inputRef = useRef();
  const passwordRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginHandler = async () => {
    const inputValue = inputRef.current.value.trim();
    const password = passwordRef.current.value.trim();

    if (!inputValue) return alert('Please enter username or email');
    if (!password) return alert('Please enter password');

    try {
      const { data } = await axios.post('login', {
        username: inputValue,
        email: inputValue,
        password: password
      });
      console.log(data);
      dispatch({ type: 'SET_USER', payload: data.user });
      navigate('/app');
    } catch (error) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login to Your Account</h2>
        <input
          ref={inputRef}
          type='text'
          placeholder='Enter username or email'
          style={styles.input}
        />
        <input
          ref={passwordRef}
          type='password'
          placeholder='Enter password'
          style={styles.input}
        />
        <button onClick={loginHandler} style={styles.button}>
          Login
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(to right, #EF4F5F,rgb(204, 86, 98))',
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  title: {
    marginBottom: '20px',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  button: {
    width: '100%',
    padding: '12px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#EF4F5F',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default Login;
