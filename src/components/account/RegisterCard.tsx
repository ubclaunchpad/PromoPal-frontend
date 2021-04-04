import './RegisterCard.less';

import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Tooltip } from 'antd';
import React, { ReactElement, useState } from 'react';
import { useHistory } from 'react-router-dom';

import UserService from '../../services/UserService';
import { FirebaseAuthError } from '../../types/firebase';
import { InputRules } from '../../types/rules';
import { UserInput } from '../../types/user';

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
  const [isDisabled, setDisabled] = useState(false);

  const onFinish = (data: UserInput): void => {
    setDisabled(true);
    UserService.registerUser(data)
      .then(() => {
        history.push('/');
        const successMessage = "Welcome aboard! We're excited to have you here.";
        message.success(successMessage, 5);
        setDisabled(false);
      })
      .catch((err: FirebaseAuthError) => {
        let errorMessage = '';
        if (err?.code === '400') {
          if (err.message.startsWith('EMAIL_EXISTS')) {
            errorMessage =
              'An account with this email already exists. Please try logging in with your credentials instead.';
          }
        } else {
          errorMessage =
            'An error occurred while attempting to register your account! Please try again later.';
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
        className="input-wrapper"
        name="username"
        rules={InputRules.username}
        hasFeedback={true}
      >
        <Input placeholder="Username" />
      </Form.Item>
      <Form.Item className="input-wrapper" name="email" rules={InputRules.email} hasFeedback={true}>
        <Input placeholder="Email" />
      </Form.Item>
      <Form.Item
        className="input-wrapper"
        name="password"
        rules={InputRules.password}
        hasFeedback={true}
      >
        <Input.Password placeholder="Password" />
      </Form.Item>
      <Form.Item
        className="input-wrapper"
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
        <Button className="button register-button" htmlType="submit" disabled={isDisabled}>
          Register
        </Button>
      </Form.Item>
    </Form>
  );
}
