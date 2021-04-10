import './RegisterCard.less';

import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, message, Row, Tooltip } from 'antd';
import React, { ReactElement, useState } from 'react';
import { useHistory } from 'react-router-dom';

import UserService from '../../services/UserService';
import { FirebaseAuthError } from '../../types/firebase';
import { InputRules } from '../../types/rules';
import { UserInput } from '../../types/user';

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
      <Tooltip className="back-button" title="Back">
        <Button shape="circle" onClick={props.onClickBack} icon={<ArrowLeftOutlined />} />
      </Tooltip>

      <h1 className="register-account-title">Create an account</h1>
      <p>Create an account to upload promotions and save deals you like.</p>

      <Row gutter={6} style={{ marginBottom: 5 }}>
        <Col span={12}>
          <Form.Item name="firstName" rules={InputRules.firstName} hasFeedback={true}>
            <Input placeholder="First name" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="lastName" rules={InputRules.lastName} hasFeedback={true}>
            <Input placeholder="Last name" />
          </Form.Item>
        </Col>
      </Row>

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

      <Form.Item className="register-button-container">
        <Button className="button register-button" htmlType="submit" disabled={isDisabled}>
          Register
        </Button>
      </Form.Item>
    </Form>
  );
}
