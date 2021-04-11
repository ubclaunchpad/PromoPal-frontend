import './ForgotPasswordCard.less';

import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Tooltip } from 'antd';
import React, { ReactElement } from 'react';

import UserService from '../../services/UserService';
import { InputRules } from '../../types/rules';

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

interface Props {
  onClickBack: () => void;
}

export default function ForgotPasswordCard(props: Props): ReactElement {
  const onFinish = (data: { email: string }): void => {
    UserService.resetUserPassword(data.email);
    const successMessage =
      'A password reset email has been sent if an account with the email exists';
    message.success(successMessage, 5);
  };

  const onFinishFailed = (): void => {
    const errorMessage = 'An error occurred! Please review the form to see what went wrong.';
    message.error(errorMessage, 5);
  };

  return (
    <Form
      {...layout}
      className="forgot-password-form"
      name="forgotPassword"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Tooltip className="back-button" title="Back">
        <Button shape="circle" onClick={props.onClickBack} icon={<ArrowLeftOutlined />} />
      </Tooltip>
      <h1 className="reset-password-title">Reset Password</h1>
      <p>Please enter your email to reset your password.</p>
      <Form.Item
        className="account-input-wrapper"
        label="Email"
        name="email"
        rules={InputRules.email}
        hasFeedback={true}
      >
        <Input placeholder="Email" />
      </Form.Item>
      <Form.Item className="reset-password-button-container">
        <Button className="button reset-password-button" htmlType="submit">
          Reset Password
        </Button>
      </Form.Item>
    </Form>
  );
}
