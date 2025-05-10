import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Styles from './SignupPage.module.css';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: ''
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('username', formData.username);
      submitData.append('email', formData.email);
      submitData.append('password', formData.password);
      if (image) {
        submitData.append('image', image);
      }

      const response = await axios.post('http://localhost:4444/signup', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess('Account created successfully! You can now log in.');
      setFormData({ name: '', username: '', email: '', password: '' });
      setImage(null);

    } catch (err) {
      console.error("Signup error:", err);
      setError(err.response?.data?.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={Styles['signup-container']}>
      <div className={Styles['signup-card']}>
        <h1 className={Styles['signup-title']}>Create Your Account</h1>

        {error && (
          <div className={Styles['message-error']} role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className={Styles['message-success']} role="alert">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className={Styles['signup-form']}>
          <div className={Styles['form-group']}>
            <label htmlFor="name" className={Styles['form-label']}>Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={Styles['form-input']}
              required
            />
          </div>

          <div className={Styles['form-group']}>
            <label htmlFor="username" className={Styles['form-label']}>Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={Styles['form-input']}
              required
            />
          </div>

          <div className={Styles['form-group']}>
            <label htmlFor="email" className={Styles['form-label']}>Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={Styles['form-input']}
              required
            />
          </div>

          <div className={Styles['form-group']}>
            <label htmlFor="password" className={Styles['form-label']}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={Styles['form-input']}
              required
            />
          </div>

          <div className={Styles['form-group']}>
            <label htmlFor="image" className={Styles['form-label']}>Profile Image</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
              className={Styles['form-file-input']}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={Styles['signup-button']}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className={Styles['login-link-container']}>
          <p>
            Already have an account?{' '}
            <a href="/login" className={Styles['login-link']}>
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
