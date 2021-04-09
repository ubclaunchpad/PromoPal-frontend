import { Button, Checkbox, Form, Input } from 'antd';
import React, { CSSProperties, ReactElement, useState } from 'react';
import { useHistory } from 'react-router-dom';

import UserService from '../../services/UserService';
import { InputRules } from '../../types/rules';

const styles: { [identifier: string]: CSSProperties } = {
  button: {
    float: 'left',
  },
  forgot: {
    marginLeft: 15,
  },
  inputWrapper: {
    marginBottom: 15,
  },
};

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
  const history = useHistory();
  const [isDisabled, setDisabled] = useState(false);

  const onFinish = (data: { email: string; password: string; staySignedIn: boolean }): void => {
    setDisabled(true);
    UserService.loginUser(data)
      .then(() => {
        history.push('/');
        setDisabled(false);
      })
      .catch((err: Error) => {
        // TODO: https://promopal.atlassian.net/browse/PP-80
        alert(err.message);
        setDisabled(false);
      });
  };

  const onFinishFailed = (): void => {
    // TODO: https://promopal.atlassian.net/browse/PP-80
    alert('Please submit the form after filling out all fields.');
    setDisabled(false);
  };

  return (
    <>
      <Form
        {...layout}
        name="loginCard"
        initialValues={{ staySignedIn: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        requiredMark={false}
      >
        <h1>Login</h1>
        <p>Login to see your favourite deals and upload promotions.</p>
        <Form.Item
          name="email"
          style={styles.inputWrapper}
          rules={InputRules.email}
          hasFeedback={true}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          style={styles.inputWrapper}
          rules={InputRules.password}
          hasFeedback={true}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item name="staySignedIn" valuePropName="checked">
          <Checkbox>Stay signed in</Checkbox>
        </Form.Item>
        <Form.Item>
          <Button className="button" style={styles.button} htmlType="submit" disabled={isDisabled}>
            Login
          </Button>
          <button
            className="link-button"
            style={styles.forgot}
            onClick={props.onClickForgotPassword}
            disabled={isDisabled}
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
            className="button"
            style={styles.button}
            disabled={isDisabled}
          >
            Register here!
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
