import './MyAccount.less';

import { Col, Row } from 'antd';
import React, { ReactElement, useEffect, useState } from 'react';

import AccountDetails from '../components/account/AccountDetails';
import AccountPhoto from '../components/account/AccountPhoto';
import ChangePassword from '../components/account/ChangePassword';
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
    <Row className="account-container" justify="space-around">
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
        <ChangePassword />
      </Col>
    </Row>
  );
}
