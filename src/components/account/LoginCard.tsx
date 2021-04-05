import './LoginCard.less';

import { Button, Checkbox, Form, Input, message } from 'antd';
import React, { ReactElement, useState } from 'react';
import { useHistory } from 'react-router-dom';

import UserService from '../../services/UserService';
import { FirebaseAuthError } from '../../types/firebase';
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
  onClickForgotPassword: () => void;
  onClickRegister: () => void;
}

export default function LoginCard(props: Props): ReactElement {
  const history = useHistory();
  const [isDisabled, setDisabled] = useState(false);

  const onFinish = (data: { email: string; password: string; staySignedIn: boolean }): void => {
    setDisabled(true);
    UserService.loginUser(data)
      .then(() => {
        history.push('/');
        const successMessage = 'Welcome back!';
        message.success(successMessage, 5);
        setDisabled(false);
      })
      .catch((err: FirebaseAuthError) => {
        let errorMessage = '';
        if (err?.code === '400') {
          if (err.message.startsWith('TOO_MANY_ATTEMPTS_TRY_LATER')) {
            errorMessage = `Access to this account has been temporarily disabled due to many failed login attempts.
              You can immediately restore it by resetting your password or you can try again later.`;
          } else if (err.message.startsWith('INVALID_PASSWORD')) {
            errorMessage = 'The password entered is incorrect. Please try again.';
          }
        } else {
          errorMessage = 'An error occurred while attempting to log in! Please try again later.';
        }
        message.error(errorMessage, 5);
        setDisabled(false);
      });
  };

  const onFinishFailed = (): void => {
    const errorMessage = 'An error occurred! Please review the form to see what went wrong.';
    message.error(errorMessage, 5);
    setDisabled(false);
  };

  return (
    <Form
      {...layout}
      name="loginCard"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      requiredMark={false}
    >
      <h1 className="login-title">Login</h1>
      <p>Login to see your favourite deals and upload promotions.</p>
      <Form.Item name="email" className="input-wrapper" rules={InputRules.email} hasFeedback={true}>
        <Input placeholder="Email" />
      </Form.Item>
      <Form.Item
        name="password"
        className="input-wrapper"
        rules={InputRules.loginPassword}
        hasFeedback={true}
      >
        <Input.Password placeholder="Password" />
      </Form.Item>
      <Form.Item name="remember" valuePropName="checked">
        <Checkbox>Stay signed in</Checkbox>
      </Form.Item>
      <Form.Item className="login-button-container">
        <Button className="button login-button" htmlType="submit" disabled={isDisabled}>
          Login
        </Button>
        <button
          className="forgot-password-button"
          onClick={props.onClickForgotPassword}
          disabled={isDisabled}
        >
          Forgot password?
        </button>
      </Form.Item>
      <Form.Item className="register-button-container">
        <p className="input-label">Don't have an account yet?</p>
        <Button
          shape="round"
          className="button register-button"
          onClick={props.onClickRegister}
          disabled={isDisabled}
        >
          Register here!
        </Button>
      </Form.Item>
    </Form>
  );
}
