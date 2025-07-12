import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Styles/ResetPasswordScreen.module.css';
import API from '../../utils/api';

function ResetPasswordScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { emailOrMobile } = location.state || {};

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      alert('Please fill all fields');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      await API.post('/admin/reset-password', {
        emailOrMobile,
        password,
      });

      alert('Password has been reset');
      navigate('/login');
    } catch (err) {
      console.error('Reset error:', err);
      alert(err?.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Reset Password</h2>
      <p className={styles.subtitle}>Email: {emailOrMobile}</p>

      <input
        type="password"
        placeholder="New Password"
        className={styles.input}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="Confirm Password"
        className={styles.input}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button className={styles.button} onClick={handleResetPassword}>
        Reset Password
      </button>
    </div>
  );
}

export default ResetPasswordScreen;
