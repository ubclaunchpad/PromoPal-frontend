import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Form, Input, Tooltip } from 'antd';
import React, { CSSProperties, ReactElement } from 'react';
import { useHistory } from 'react-router-dom';

import UserService from '../../services/UserService';
import { InputRules } from '../../types/rules';
import { UserInput } from '../../types/user';

const styles: { [identifier: string]: CSSProperties } = {
  button: {
    float: 'left',
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
  onClickBack: () => void;
}

export default function RegisterCard(props: Props): ReactElement {
  const history = useHistory();

  const onFinish = (data: UserInput): void => {
    UserService.registerUser(data)
      .then(() => {
        history.push('/');
      })
      .catch((err: Error) => {
        // TODO: https://promopal.atlassian.net/browse/PP-80
        alert(err.message);
      });
  };

  const onFinishFailed = (): void => {
    // TODO: https://promopal.atlassian.net/browse/PP-80
    alert('Please submit the form after filling out all fields.');
  };

  return (
    <Form {...layout} name="registerCard" onFinish={onFinish} onFinishFailed={onFinishFailed}>
      <Tooltip title="Back">
        <Button shape="circle" onClick={props.onClickBack} icon={<ArrowLeftOutlined />} />
      </Tooltip>
      <h1>Create an account</h1>
      <p>Create an account to upload promotions and save deals you like.</p>
      <Form.Item style={{ marginBottom: 10 }}>
        <Form.Item
          name="firstName"
          rules={InputRules.firstName}
          style={{ display: 'inline-block', width: 'calc(50% - 6px)', marginRight: 6 }}
          hasFeedback={true}
        >
          <Input placeholder="First name" />
        </Form.Item>
        <Form.Item
          name="lastName"
          rules={InputRules.lastName}
          style={{ display: 'inline-block', width: 'calc(50% - 6px)', marginLeft: 6 }}
          hasFeedback={true}
        >
          <Input placeholder="Last name" />
        </Form.Item>
      </Form.Item>

      <Form.Item
        style={styles.inputWrapper}
        name="username"
        rules={InputRules.username}
        hasFeedback={true}
      >
        <Input placeholder="Username" />
      </Form.Item>
      <Form.Item
        style={styles.inputWrapper}
        name="email"
        rules={InputRules.email}
        hasFeedback={true}
      >
        <Input placeholder="Email" />
      </Form.Item>
      <Form.Item
        style={styles.inputWrapper}
        name="password"
        rules={InputRules.password}
        hasFeedback={true}
      >
        <Input.Password placeholder="Password" />
      </Form.Item>
      <Form.Item
        style={styles.inputWrapper}
        name="confirmPassword"
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
        hasFeedback={true}
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
