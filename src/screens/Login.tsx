import '../index.less';
import './Login.less';

import React, { ReactElement, useState } from 'react';

import ForgotPasswordCard from '../components/account/ForgotPasswordCard';
import LoginCard from '../components/account/LoginCard';
import RegisterCard from '../components/account/RegisterCard';

export default function Login(): ReactElement {
  const [state, setState] = useState<string>('Login');
  return (
    <div className="login-container">
      {state === 'Login' && (
        <LoginCard
          onClickForgotPassword={() => setState('Forgot Password')}
          onClickRegister={() => setState('Register')}
        />
      )}
      {state === 'Forgot Password' && <ForgotPasswordCard onClickBack={() => setState('Login')} />}
      {state === 'Register' && <RegisterCard onClickBack={() => setState('Login')} />}
    </div>
  );
}
