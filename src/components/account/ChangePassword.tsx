import { Button, Form, Input } from 'antd';
import React, { CSSProperties, ReactElement } from 'react';

import { useFirebase } from '../../contexts/FirebaseContext';

const styles: { [identifier: string]: CSSProperties } = {
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    boxShadow: '0 4px 4px 0 #40333333',
    color: 'black',
    margin: 30,
    overflow: 'auto',
    paddingTop: 30,
    paddingRight: 30,
    paddingLeft: 30,
  },
};

export default function ChangePassword(): ReactElement {
  const firebase = useFirebase();

  const onFinish = (data: { oldPassword: string; newPassword: string }) => {
    firebase
      .doPasswordUpdate(data.oldPassword, data.newPassword)
      .then(() => {
        // TODO: https://promopal.atlassian.net/browse/PP-80
        alert('Your password was changed');
      })
      .catch((err: Error) => {
        alert(err.message);
      });
  };

  const onFinishFailed = () => {
    // TODO: https://promopal.atlassian.net/browse/PP-80
    alert('Please submit the form after filling out all fields.');
  };

  return (
    <div style={styles.container}>
      <Form
        name="changePassword"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <h1>Change Password</h1>
        <Form.Item
          name="oldPassword"
          rules={[
            { required: true, message: 'Please enter your old password.' },
            { min: 9, message: 'Passwords must be at least 9 characters.' },
          ]}
          hasFeedback={true}
        >
          <Input.Password placeholder="Old Password" />
        </Form.Item>
        <Form.Item
          name="newPassword"
          rules={[
            { required: true, message: 'A new password is required.' },
            { min: 9, message: 'Passwords must be at least 9 characters.' },
          ]}
          hasFeedback={true}
        >
          <Input.Password placeholder="New Password" />
        </Form.Item>
        <Form.Item
          name="confirmNewPassword"
          dependencies={['newPassword']}
          rules={[
            {
              required: true,
              message: 'You must confirm your new password.',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('The two passwords that you entered do not match!')
                );
              },
            }),
          ]}
          hasFeedback={true}
        >
          <Input.Password placeholder="Confirm New Password" />
        </Form.Item>
        <Form.Item>
          <Button size="large" shape="round" className="button" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
