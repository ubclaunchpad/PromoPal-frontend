import { Col, Row } from 'antd';
import React, { CSSProperties, ReactElement } from 'react';

import AccountDetails from '../components/account/AccountDetails';
import AccountPhoto from '../components/account/AccountPhoto';
import ChangePassword from '../components/account/ChangePassword';
import { User } from '../types/promotion';

const user: User = {
  id: 'u1',
  email: 'example@abc.com',
  firstName: 'John',
  lastName: 'Lee',
  password: '123',
  username: 'user',
};

const styles: { [identifier: string]: CSSProperties } = {
  body: {
    backgroundColor: '#FFEDDC',
    padding: 25,
    width: '100vw',
    height: '100vh',
    display: 'inline-flex',
  },
};

export default function MyAccount(): ReactElement {
  return (
    <Row style={styles.body} justify="space-around">
      <Col span={4}>
        <AccountPhoto />
      </Col>
      <Col span={10}>
        <AccountDetails {...user} />
      </Col>
      <Col span={10}>
        <ChangePassword />
      </Col>
    </Row>
  );
}
