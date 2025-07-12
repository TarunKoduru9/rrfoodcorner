import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Styles/VerifyOTPScreen.module.css';
import API from '../../utils/api';

function VerifyOTPScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { emailOrMobile } = location.state || {};

  const [otp, setOtp] = useState('');

  const handleVerifyOTP = async () => {
    if (!otp) {
      alert('Please enter the OTP');
      return;
    }

    try {
      await API.post('/admin/verify-otp', {
        emailOrMobile,
        otp,
      });

      alert('OTP verified. Please reset your password.');
      navigate('/reset-password', { state: { emailOrMobile } });
    } catch (err) {
      console.error('OTP verify error:', err);
      alert(err?.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Verify OTP</h2>
      <p className={styles.subtitle}>Sent to {emailOrMobile}</p>

      <input
        className={styles.input}
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <button className={styles.button} onClick={handleVerifyOTP}>
        Verify
      </button>
    </div>
  );
}

export default VerifyOTPScreen;
