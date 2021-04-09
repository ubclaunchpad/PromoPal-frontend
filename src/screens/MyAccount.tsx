import { Col, Row } from 'antd';
import React, { CSSProperties, ReactElement } from 'react';
import { Redirect } from 'react-router-dom';

import AccountDetails from '../components/account/AccountDetails';
import AccountPhoto from '../components/account/AccountPhoto';
import ChangePassword from '../components/account/ChangePassword';
import { useAuthUser } from '../contexts/AuthUserContext';

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

  if (!authUser) {
    return <Redirect to="/account" />;
  }
  return (
    <Row style={styles.body} justify="space-around">
      <Col span={4}>
        <AccountPhoto />
      </Col>
      <Col span={10}>
        <AccountDetails {...authUser} />
      </Col>
      <Col span={10}>
        <ChangePassword />
      </Col>
    </Row>
  );
}
