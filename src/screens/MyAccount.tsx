import './MyAccount.less';

import { Col, Input, message, Row } from 'antd';
import React, { ChangeEvent, ReactElement, useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';

import AccountDetails from '../components/account/AccountDetails';
import AccountPhoto from '../components/account/AccountPhoto';
import ChangePassword from '../components/account/ChangePassword';
import DeleteModal from '../components/modal/DeleteModal';
import { useAuthUser } from '../contexts/AuthUserContext';
import UserService from '../services/UserService';

export default function MyAccount(): ReactElement {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');

  const authUser = useAuthUser();
  const history = useHistory();

  const onDeleteUser = async (password: string): Promise<void> => {
    return UserService.deleteUser(authUser?.user.id || '', password)
      .then(() => {
        setIsModalVisible(false);

        const successMessage =
          "Your account has successfully been deleted. We're sad to see you go!";
        message.success(successMessage, 5);

        return UserService.signUserOut();
      })
      .then(() => {
        // Redirect user to login page
        history.push('/account');
      })
      .catch(() => {
        setIsModalVisible(false);

        const errorMessage = 'An error occurred! Please try again later.';
        message.error(errorMessage, 5);
      });
  };

  const onDeleteCancel = async (): Promise<void> => {
    setIsModalVisible(false);
  };

  const onPasswordChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setPassword(event.target.value);
  };

  if (!authUser) {
    return <Redirect to="/account" />;
  }
  return (
    <Row className="account-container" justify="space-around">
      <Col span={4}>
        <AccountPhoto onDeleteUser={() => setIsModalVisible(true)} />
      </Col>
      <Col span={10}>
        <AccountDetails {...authUser} />
      </Col>
      <Col span={10}>
        <ChangePassword />
      </Col>
      <DeleteModal
        title="Delete Account"
        description={
          <>
            <p>
              Are you sure you want to delete your account?{' '}
              <strong>This action is irreversible.</strong>
            </p>
            Please enter your password below to confirm.
            <Input.Password
              placeholder="Enter your password"
              value={password}
              onChange={onPasswordChange}
            />
          </>
        }
        isVisible={isModalVisible}
        onOk={() => onDeleteUser(password)}
        onCancel={onDeleteCancel}
      />
    </Row>
  );
}
