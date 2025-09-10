import { useState } from 'react';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      {isLogin ? (
        <Login onSwitchToRegister={() => setIsLogin(false)} />
      ) : (
        <Register onSwitchToLogin={() => setIsLogin(true)} />
      )}
    </>
  );
}
