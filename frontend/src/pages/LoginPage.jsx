import React, { useState } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput
} from 'mdb-react-ui-kit';
import axios from 'axios';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/auth/login', {
        email: email.toLowerCase().trim(),
        password,
      });
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('user_id', res.data.user.id);
      setMessage("✅ Login successful!");
      window.location.href = "/dashboard";
    } catch (err) {
      setMessage("❌ Email or password incorrect.");
    }
  };

  return (
    <MDBContainer
      fluid
      className="min-vh-100 d-flex justify-content-center align-items-center"
      style={{ background: "radial-gradient(circle at center, #1c1c1c, #0f0f0f 90%)" }}
    >
      <MDBCard style={{ width: '100%', maxWidth: '420px', borderRadius: '1rem', backgroundColor: '#2c2c2c' }} className="text-white p-4 shadow-lg">
        <MDBCardBody className="text-center">

          {/* لوگو بالا */}
          <img
            src="/logo.png"
            alt="Part Group Logo"
            style={{ width: '100px', marginBottom: '1rem' }}
          />

          <h2 className='fw-bold mb-3'>Login</h2>
          <p className='text-white-50 mb-4'>Please enter your login and password</p>

          <form onSubmit={handleLogin}>
            <MDBInput
              label="Email"
              
              type="email"
              className="mb-4"
              size="lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              
            />

            <MDBInput
              label="Password"
              type="password"
              className="mb-4"
              size="lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              
            />

            <div className='text-end mb-3'>
              <a href='#!' className='text-white-50 small'>Forgot password?</a>
            </div>

            <div className='d-grid'>
              <MDBBtn type='submit' color='warning' size='lg'>
                LOGIN
              </MDBBtn>
            </div>
          </form>

          {message && <p className="text-danger mt-4 mb-0">{message}</p>}

        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}
