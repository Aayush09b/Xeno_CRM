import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from '../components/Login';
import { Box, Button, Typography } from '@mui/material';

const LoginPage = () => {
  const { user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <Box>
      <Login isLogin={isLogin} />
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Button onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Need an account? Sign up' : 'Already have an account? Login'}
        </Button>
      </Box>
    </Box>
  );
};

export default LoginPage;