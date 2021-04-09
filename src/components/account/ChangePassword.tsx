import './AccountDetails.css';

import { Button, Form, Input } from 'antd';
import React, { ReactElement } from 'react';

import UserService from '../../services/UserService';
import { InputRules } from '../../types/rules';

export default function ChangePassword(): ReactElement {
  const onFinish = (data: { oldPassword: string; newPassword: string }): void => {
    UserService.updateUserPassword(data.oldPassword, data.newPassword)
      .then(() => {
        // TODO: https://promopal.atlassian.net/browse/PP-80
        alert('Your password was changed');
      })
      .catch((err: Error) => {
        alert(err.message);
      });
  };

  const onFinishFailed = (): void => {
    // TODO: https://promopal.atlassian.net/browse/PP-80
    alert('Please submit the form after filling out all fields.');
  };

  return (
    <div className="account-details-container">
      <Form
        name="changePassword"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <h1>Change Password</h1>
        <Form.Item
          name="oldPassword"
          rules={InputRules.password}
          hasFeedback={true}
          style={{ marginTop: 16 }}
        >
          <Input.Password placeholder="Old Password" />
        </Form.Item>
        <Form.Item
          name="newPassword"
          rules={InputRules.password}
          hasFeedback={true}
          style={{ marginTop: 16 }}
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
          style={{ marginTop: 16 }}
        >
          <Input.Password placeholder="Confirm New Password" />
        </Form.Item>
        <Form.Item noStyle={true}>
          <Button className="save-button" size="large" shape="round" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
