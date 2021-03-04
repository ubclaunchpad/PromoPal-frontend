import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Form, Input, Tooltip } from 'antd';
import React, { CSSProperties, ReactElement } from 'react';

const styles: { [identifier: string]: CSSProperties } = {
  button: {
    float: 'left',
  },
  inputWrapper: {
    marginBottom: 15,
  },
};

interface Props {
  onClickBack: () => void;
}

export default function RegisterCard(props: Props): ReactElement {
  const onFinish = () => {
    alert('Finish');
    //console.log('Success:', values);
    // TODO https://promopal.atlassian.net/jira/software/projects/PP/boards/1?selectedIssue=PP-35
    // TODO https://promopal.atlassian.net/jira/software/projects/PP/boards/1?selectedIssue=PP-37
  };

  const onFinishFailed = () => {
    //console.log('Failed:', errorInfo);
    // TODO https://promopal.atlassian.net/jira/software/projects/PP/boards/1?selectedIssue=PP-38
  };

  return (
    <Form
      name="registerCard"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Tooltip title="Back">
        <Button shape="circle" onClick={props.onClickBack} icon={<ArrowLeftOutlined />} />
      </Tooltip>
      <h1>Create an account</h1>
      <p>Create an account to upload promotions and save deals you like.</p>
      <Form.Item
        style={styles.inputWrapper}
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'An email is required.' },
          { type: 'email', message: 'The input is not a valid email.' },
        ]}
      >
        <Input placeholder="Email" />
      </Form.Item>
      <Form.Item
        style={styles.inputWrapper}
        name="username"
        label="Username"
        rules={[{ required: true, message: 'A username is required.' }]}
      >
        <Input placeholder="Username" />
      </Form.Item>
      <Form.Item
        style={styles.inputWrapper}
        name="password"
        label="Password"
        rules={[
          { required: true, message: 'A password is required.' },
          { min: 9, message: 'Passwords must be at least 9 characters.' },
        ]}
        hasFeedback
      >
        <Input.Password placeholder="Password" />
      </Form.Item>
      <Form.Item
        style={styles.inputWrapper}
        name="confirmPassword"
        label="Confirm Password"
        dependencies={['password']}
        rules={[
          {
            required: true,
            message: 'You must confirm your password.',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('The two passwords that you entered do not match!'));
            },
          }),
        ]}
        hasFeedback
      >
        <Input.Password placeholder="Confirm Password" />
      </Form.Item>
      <Form.Item>
        <Button className="button" style={styles.button} htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
  );
}
