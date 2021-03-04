import { Button, Checkbox, Form, Input } from 'antd';
import React, { CSSProperties, ReactElement } from 'react';

const styles: { [identifier: string]: CSSProperties } = {
  button: {
    float: 'left',
  },
  inputWrapper: {
    marginBottom: 15,
  },
};

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 },
};
const tailLayout = {
  wrapperCol: { offset: 4, span: 8 },
};
interface Props {
  onClickRegister: () => void;
}

export default function LoginCard(props: Props): ReactElement {
  const onFinish = () => {
    alert('Finish');
    //console.log('Success:', values);
    // TODO https://promopal.atlassian.net/jira/software/projects/PP/boards/1?selectedIssue=PP-42
    // TODO https://promopal.atlassian.net/jira/software/projects/PP/boards/1?selectedIssue=PP-43
  };

  const onFinishFailed = () => {
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
          name="username"
          style={styles.inputWrapper}
          label="Username or email"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input placeholder="Username or email" />
        </Form.Item>
        <Form.Item
          name="password"
          style={styles.inputWrapper}
          label="Password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item {...tailLayout} name="remember" valuePropName="checked">
          <Checkbox>Stay signed in</Checkbox>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button className="button" style={styles.button} htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>

      <p className="inputLabel">Don't have an account yet?</p>
      <Button
        size="large"
        shape="round"
        onClick={props.onClickRegister}
        className="button"
        style={styles.button}
      >
        Register here!
      </Button>
    </>
  );
}
