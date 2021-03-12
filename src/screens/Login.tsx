import '../index.css';

import React, { CSSProperties, ReactElement, useState } from 'react';

import ForgotPasswordCard from '../components/account/ForgotPasswordCard';
import LoginCard from '../components/account/LoginCard';
import RegisterCard from '../components/account/RegisterCard';

const styles: { [identifier: string]: CSSProperties } = {
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    boxShadow: '0 4px 4px 0 #40333333',
    color: '#333',
    margin: 30,
    overflow: 'auto',
    padding: 30,
  },
};

export default function Login(): ReactElement {
  const [state, setState] = useState<string>('Login');
  return (
    <div style={styles.container}>
      {state == 'Login' && (
        <LoginCard
          onClickForgotPassword={() => setState('Forgot Password')}
          onClickRegister={() => setState('Register')}
        />
      )}
      {state == 'Forgot Password' && <ForgotPasswordCard onClickBack={() => setState('Login')} />}
      {state == 'Register' && <RegisterCard onClickBack={() => setState('Login')} />}
    </div>
  );
}
