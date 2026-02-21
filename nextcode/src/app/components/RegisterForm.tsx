// src/app/components/RegisterForm.tsx
import React from 'react';

interface RegisterFormProps {
  onLoginClick: () => void; // Function to switch back to Login view
}

const RED_COLOR = '#B52222';
const JAPURA_EATS_COLOR = '#AA2B2B'; 

const RegisterForm: React.FC<RegisterFormProps> = ({ onLoginClick }) => {
  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        // Handle Registration logic here
      }}
      style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
    >
      {/* Name Field */}
      <div className="w-full">
        <label className="block text-base font-semibold text-gray-800" style={{ marginBottom: '0.25rem' }}>
          Full Name
        </label>
        <input
          type="text"
          placeholder="Enter your full name"
          required
          className="w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-red-300 focus:border-red-400"
          style={{ 
              paddingTop: '0.75rem', 
              paddingBottom: '0.75rem',
              paddingLeft: '1rem', 
              paddingRight: '1rem', 
              backgroundColor: '#EAEAEA',
              fontSize: '0.9rem' 
          }}
        />
      </div>

      {/* Email Field */}
      <div className="w-full">
        <label className="block text-base font-semibold text-gray-800" style={{ marginBottom: '0.25rem' }}>
          Email
        </label>
        <input
          type="email"
          placeholder="Enter your email"
          required
          className="w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-red-300 focus:border-red-400"
          style={{ 
              paddingTop: '0.75rem', 
              paddingBottom: '0.75rem',
              paddingLeft: '1rem', 
              paddingRight: '1rem', 
              backgroundColor: '#EAEAEA',
              fontSize: '0.9rem' 
          }}
        />
      </div>

      {/* Password Field */}
      <div className="w-full">
        <label className="block text-base font-semibold text-gray-800" style={{ marginBottom: '0.25rem' }}>
          Password
        </label>
        <input
          type="password"
          placeholder="Create Password"
          required
          className="w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-red-300 focus:border-red-400"
          style={{ 
              paddingTop: '0.75rem', 
              paddingBottom: '0.75rem',
              paddingLeft: '1rem', 
              paddingRight: '1rem', 
              backgroundColor: '#EAEAEA',
              fontSize: '0.9rem' 
          }}
        />
      </div>

      {/* Confirm Password Field */}
      <div className="w-full">
        <label className="block text-base font-semibold text-gray-800" style={{ marginBottom: '0.25rem' }}>
          Confirm Password
        </label>
        <input
          type="password"
          placeholder="Confirm your Password"
          required
          className="w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-red-300 focus:border-red-400"
          style={{ 
              paddingTop: '0.75rem', 
              paddingBottom: '0.75rem',
              paddingLeft: '1rem', 
              paddingRight: '1rem', 
              backgroundColor: '#EAEAEA',
              fontSize: '0.9rem' 
          }}
        />
      </div>


      {/* Register Button */}
      <button
        type="submit"
        className="w-full text-white font-bold rounded-md shadow-md transition-colors"
        style={{ 
            backgroundColor: RED_COLOR,
            paddingTop: '1rem', 
            paddingBottom: '1rem', 
            fontSize: '1.25rem', 
            marginTop: '1rem', 
        }}
      >
        REGISTER
      </button>

      {/* Login Link */}
      <div className="text-center text-sm text-gray-600" style={{ marginTop: '0.75rem' }}>
        Already have an account?{' '}
        <button 
          type="button" // Important: use type="button" to prevent form submission
          onClick={onLoginClick} 
          className="font-semibold hover:underline" 
          style={{ color: RED_COLOR }}
        >
          Login
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;