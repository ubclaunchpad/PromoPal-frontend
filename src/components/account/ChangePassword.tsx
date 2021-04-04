import './ChangePassword.less';

import { Button, Form, Input, message } from 'antd';
import React, { ReactElement } from 'react';

import UserService from '../../services/UserService';
import { InputRules } from '../../types/rules';

export default function ChangePassword(): ReactElement {
  const onFinish = (data: { oldPassword: string; newPassword: string }): void => {
    UserService.updateUserPassword(data.oldPassword, data.newPassword)
      .then(() => {
        const successMessage = 'Your new password was saved successfully!';
        message.success(successMessage, 5);
      })
      .catch(() => {
        const errorMessage =
          'An error occurred while resetting your password! Please try again later.';
        message.error(errorMessage, 5);
      });
  };

  const onFinishFailed = (): void => {
    const errorMessage = 'An error occurred! Please review the form to see what went wrong.';
    message.error(errorMessage, 5);
  };

  return (
    <div className="change-password-container">
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
