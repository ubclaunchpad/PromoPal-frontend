import { Col, Row } from 'antd';
import React, { CSSProperties, ReactElement } from 'react';

import AccountDetails from '../components/account/AccountDetails';
import AccountPhoto from '../components/account/AccountPhoto';
import ChangePassword from '../components/account/ChangePassword';
import { useAuthUser } from '../contexts/AuthUserContext';
import { User } from '../types/user';

const defaultUser: User = {
  id: '',
  firstName: '',
  lastName: '',
  username: '',
  email: '',
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
  const authUser = useAuthUser();
  return (
    <Row style={styles.body} justify="space-around">
      <Col span={4}>
        <AccountPhoto />
      </Col>
      <Col span={10}>
        {authUser ? (
          <AccountDetails
            id={authUser.user.id}
            email={authUser.user.email}
            firstName={authUser.user.firstName}
            lastName={authUser.user.lastName}
            username={authUser.user.username}
          />
        ) : (
          <AccountDetails
            id={defaultUser.id}
            email={defaultUser.email}
            firstName={defaultUser.firstName}
            lastName={defaultUser.lastName}
            username={defaultUser.username}
          />
        )}
      </Col>
      <Col span={10}>
        <ChangePassword />
      </Col>
    </Row>
  );
}
