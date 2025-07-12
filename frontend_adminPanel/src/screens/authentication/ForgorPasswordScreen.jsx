import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Styles/ForgotPasswordScreen.module.css';
import API from '../../utils/api';

function ForgotPasswordScreen() {
  const navigate = useNavigate();
  const [emailOrMobile, setEmailOrMobile] = useState('');

  const handleSendOTP = async () => {
    if (!emailOrMobile) {
      alert('Please enter your email or mobile');
      return;
    }

    try {
      await API.post('/admin/send-otp', { emailOrMobile });
      alert('OTP sent to your email');
      navigate('/verify-otp', { state: { emailOrMobile } });
    } catch (err) {
      console.error('OTP error:', err);
      alert(err?.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Forgot Password</h2>

      <input
        type="text"
        className={styles.input}
        placeholder="Enter your email or mobile"
        value={emailOrMobile}
        onChange={(e) => setEmailOrMobile(e.target.value)}
      />

      <button className={styles.button} onClick={handleSendOTP}>
        Send OTP
      </button>
    </div>
  );
}

export default ForgotPasswordScreen;
