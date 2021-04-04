import { Col, message, Row } from 'antd';
import React, { CSSProperties, ReactElement, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import AccountDetails from '../components/account/AccountDetails';
import AccountPhoto from '../components/account/AccountPhoto';
import ChangePassword from '../components/account/ChangePassword';
import DeleteModal from '../components/modal/DeleteModal';
import { useFirebase } from '../contexts/FirebaseContext';
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
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [user, setUser] = useState<User>(defaultUser);

  const firebase = useFirebase();
  const history = useHistory();

  const onDeleteUser = async (): Promise<void> => {
    return UserService.deleteUser(firebase)
      .then(() => {
        setIsModalVisible(false);

        const successMessage =
          "Your account has successfully been deleted. We're sad to see you go!";
        message.success(successMessage, 5);

        return firebase.doSignOut();
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
        <AccountPhoto onDeleteUser={() => setIsModalVisible(true)} />
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
      <DeleteModal
        title="Delete Account"
        description={
          <>
            Are you sure you want to delete your account?{' '}
            <strong>This action is irreversible.</strong>
          </>
        }
        isVisible={isModalVisible}
        onOk={onDeleteUser}
        onCancel={onDeleteCancel}
      />
    </Row>
  );
}
