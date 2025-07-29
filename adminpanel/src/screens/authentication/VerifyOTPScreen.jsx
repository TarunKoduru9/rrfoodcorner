import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Verify OTP</h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Sent to <span className="font-medium">{emailOrMobile}</span>
        </p>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
        />

        <button
          onClick={handleVerifyOTP}
          className="w-full bg-[#16203bd5] hover:bg-[#16203b] text-white font-bold py-3 rounded-md transition cursor-pointer"
        >
          Verify
        </button>
      </div>
    </div>
  );
}

export default VerifyOTPScreen;
