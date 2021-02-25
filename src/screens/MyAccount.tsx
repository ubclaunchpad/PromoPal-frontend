import { Col, Row } from 'antd';
import React, { CSSProperties, ReactElement, useEffect, useState } from 'react';

import AccountDetails from '../components/account/AccountDetails';
import AccountPhoto from '../components/account/AccountPhoto';
import ResetPassword from '../components/account/ResetPassword';
import UserService from '../services/UserService';
import { User } from '../types/user';

const defaultUser: User = {
  id: '',
  email: '',
  firstName: '',
  lastName: '',
  uploadedPromotions: [],
  username: '',
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
  const [user, setUser] = useState<User>(defaultUser);

  /**
   * On initial render, gets the details of the currently logged in user.
   */
  useEffect(() => {
    UserService.getUser()
      .then((user: User) => setUser(user))
      .catch(() => setUser(defaultUser));
  }, []);

  return (
    <Row style={styles.body} justify="space-around">
      <Col span={4}>
        <AccountPhoto />
      </Col>
      <Col span={10}>
        <AccountDetails
          id={user.id}
          email={user.email}
          firstName={user.firstName}
          lastName={user.lastName}
          username={user.username}
        />
      </Col>
      <Col span={10}>
        <ResetPassword />
      </Col>
    </Row>
  );
}
