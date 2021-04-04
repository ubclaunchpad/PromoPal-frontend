import { Button, Input } from 'antd';
import React, { ReactElement } from 'react';

export default function ResetPassword(): ReactElement {
  const handleClick = (): void => {
    // TODO: reset password in firebase
    alert('Click');
  };

  const InputPasswordWrapper = ({ label }: { label: string }): ReactElement => (
    <div className="input-wrapper">
      <p className="input-label">{label}</p>
      <Input.Password placeholder="Input password" />
    </div>
  );

  return (
    <div className="change-password-container">
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
