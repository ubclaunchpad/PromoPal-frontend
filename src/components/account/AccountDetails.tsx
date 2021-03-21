/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Col, Input, Row } from 'antd';
import React, { CSSProperties, ReactElement } from 'react';

import { User } from '../../types/promotion';

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
  inputWrapper: {
    marginBottom: 15,
  },
};

export default function AccountDetails({
  id,
  email,
  firstName,
  lastName,
  password,
  username,
}: User): ReactElement {
  const handleClick = () => {
    alert('Click');
  };

  const InputWrapper = ({
    label,
    defaultValue,
  }: {
    label: string;
    defaultValue: string;
  }): ReactElement => (
    <div style={styles.inputWrapper}>
      <p className="input-label">{label}</p>
      <Input defaultValue={defaultValue} />
    </div>
  );

  return (
    <div style={styles.container}>
      <h1>Account Details</h1>

      <Row gutter={12}>
        <Col span={12}>
          <InputWrapper label="First Name" defaultValue={firstName} />
        </Col>
        <Col span={12}>
          <InputWrapper label="Last Name" defaultValue={lastName} />
        </Col>
      </Row>
      <InputWrapper label="Username" defaultValue={username} />
      <InputWrapper label="Email" defaultValue={email} />
      <Button size="large" shape="round" onClick={handleClick} className="button">
        Save
      </Button>
    </div>
  );
}
