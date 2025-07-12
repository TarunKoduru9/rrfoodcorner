import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Styles/LoginScreen.module.css';
import API from '../../utils/api';
import coverImage from '../../assets/coverimage.jpg';
import { useAuth } from '../../utils/AuthContext';

function LoginScreen() {
  const navigate = useNavigate();
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { fetchUser } = useAuth();

  const handleLogin = async () => {
    if (!emailOrMobile || !password) {
      alert('Please enter email/mobile and password');
      return;
    }

    try {
      setLoading(true);
      const response = await API.post('/admin/login', {
        emailOrMobile,
        password,
      });

      const { token } = response.data;

      localStorage.setItem('token', token);

      await fetchUser();

      alert('Login successful!');
      navigate('/panel', { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      alert(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/panel', { replace: true });
    }
  }, [navigate]);

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>RR Food Corner</h1>
      <img
        src={coverImage}
        alt="cover"
        className={styles.image}
      />
      <p className={styles.admintitle}>Admin&apos;s Only</p>

      <input
        type="text"
        placeholder="Email or Mobile"
        autoFocus
        className={styles.input}
        value={emailOrMobile}
        onChange={(e) => setEmailOrMobile(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className={styles.input}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className={styles.loginButton}
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <div className={styles.linkContainer}>
        <button
          className={styles.linkButton}
          onClick={() => navigate('/forgot-password')}
        >
          Forgot Password?
        </button>
      </div>
    </div>
  );
}

export default LoginScreen;
