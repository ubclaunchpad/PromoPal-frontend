import '../index.css';

import React, { CSSProperties, ReactElement, useState } from 'react';

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
  const [isRegistering, setIsRegistering] = useState<boolean>(false);

  return (
    <div style={styles.container}>
      {isRegistering ? (
        <RegisterCard onClickBack={() => setIsRegistering(false)} />
      ) : (
        <LoginCard onClickRegister={() => setIsRegistering(true)} />
      )}
    </div>
  );
}
