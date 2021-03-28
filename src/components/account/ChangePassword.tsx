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
  inputWrapper: {
    marginBottom: 15,
  },
};

export default function ResetPassword(): ReactElement {
  const handleClick = (): void => {
    // TODO: reset password in firebase
    alert('Click');
  };

  const InputPasswordWrapper = ({ label }: { label: string }): ReactElement => (
    <div style={styles.inputWrapper}>
      <p className="input-label">{label}</p>
      <Input.Password placeholder="Input password" />
    </div>
  );

  return (
    <div style={styles.container}>
      <h1>Reset Password</h1>
      <InputPasswordWrapper label="Current Password" />
      <InputPasswordWrapper label="New Password" />
      <InputPasswordWrapper label="Confirm New Password" />
      <Button size="large" shape="round" onClick={handleClick} className="button">
        Save
      </Button>
    </div>
  );
}
