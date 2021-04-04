import './LoginCard.less';

import { Button, Checkbox, Form, Input } from 'antd';
import React, { ReactElement } from 'react';

const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 8,
  },
};

interface Props {
  onClickForgotPassword: () => void;
  onClickRegister: () => void;
}

export default function LoginCard(props: Props): ReactElement {
  const onFinish = (): void => {
    alert('Finish');
    //console.log('Success:', values);
    // TODO https://promopal.atlassian.net/jira/software/projects/PP/boards/1?selectedIssue=PP-42
    // TODO https://promopal.atlassian.net/jira/software/projects/PP/boards/1?selectedIssue=PP-43
  };

  const onFinishFailed = (): void => {
    // TODO https://promopal.atlassian.net/jira/software/projects/PP/boards/1?selectedIssue=PP-44
    //console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Form
        {...layout}
        name="loginCard"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        requiredMark={false}
      >
        <h1>Login</h1>
        <p>Login to see your favourite deals and upload promotions.</p>
        <Form.Item
          name="email"
          className="input-wrapper"
          rules={[{ required: true, message: 'Please input your email!' }]}
          hasFeedback={true}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          className="input-wrapper"
          rules={[{ required: true, message: 'Please input your password!' }]}
          hasFeedback={true}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Stay signed in</Checkbox>
        </Form.Item>
        <Form.Item>
          <Button className="button login-button" htmlType="submit">
            Login
          </Button>
          <button
            className="link-button forgot-password-button"
            onClick={props.onClickForgotPassword}
          >
            Forgot password?
          </button>
        </Form.Item>
        <Form.Item>
          <p className="input-label">Don't have an account yet?</p>
          <Button
            size="large"
            shape="round"
            onClick={props.onClickRegister}
            className="button register-button"
          >
            Register here!
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
