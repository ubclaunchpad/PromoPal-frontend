import { Button, Input } from 'antd';
import React, { CSSProperties, ReactElement } from 'react';

const styles: { [identifier: string]: CSSProperties } = {
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    boxShadow: '0 4px 4px 0 #40333333',
    color: 'black',
    margin: 30,
    overflow: 'auto',
    padding: 30,
  },
  button: {
    backgroundColor: '#FFC529',
    float: 'right',
    fontWeight: 'bold',
    marginTop: 10,
  },
  inputLabel: {
    margin: '5px 0',
  },
  inputWrapper: {
    marginBottom: 15,
  },
};

export default function ResetPassword(): ReactElement {
  const handleClick = (): void => {
    alert('Click');
  };

  const InputPasswordWrapper = ({ label }: { label: string }): ReactElement => (
    <div style={styles.inputWrapper}>
      <p style={styles.inputLabel}>{label}</p>
      <Input.Password placeholder="Input password" />
    </div>
  );

  return (
    <div style={styles.container}>
      <h1>Reset Password</h1>

      <InputPasswordWrapper label="Current Password" />
      <InputPasswordWrapper label="New Password" />
      <InputPasswordWrapper label="Confirm New Password" />
      <Button size="large" shape="round" onClick={handleClick} style={styles.button}>
        Save
      </Button>
    </div>
  );
}
