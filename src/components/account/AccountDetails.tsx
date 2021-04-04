import './AccountDetails.css';

import { Button, Col, Form, Input, message, Row } from 'antd';
import { Rule } from 'antd/lib/form';
import React, { ReactElement } from 'react';

import { useFirebase } from '../../contexts/FirebaseContext';
import UserService from '../../services/UserService';
import { InputRules } from '../../types/rules';
import { UserInputData } from '../../types/user';

interface InputProps {
  defaultValue: string;
  label: string;
  name: string;
  rules: Rule[];
  isPassword: boolean;
}

interface Props {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
}

export default function AccountDetails(props: Props): ReactElement {
  const firebase = useFirebase();
  const [form] = Form.useForm();

  const onFinish = (data: UserInputData): void => {
    UserService.updateUser(firebase, data)
      .then(() => {
        const successMessage = 'Your changes were saved successfully!';
        message.success(successMessage, 5);
      })
      .catch(() => {
        const errorMessage = 'An error occurred! Please try again later.';
        message.error(errorMessage, 5);
      });
  };

  const onFinishFailed = (): void => {
    const errorMessage = 'An error occurred! Please review the form to see what went wrong.';
    message.error(errorMessage, 5);
  };

  function InputWrapper(inputProps: InputProps): ReactElement {
    return (
      <Form.Item name={inputProps.name} rules={inputProps.rules}>
        <div className="input-wrapper">
          <p className="input-label">{inputProps.label}</p>
          {inputProps.isPassword ? (
            <Input.Password placeholder="Enter your password to save changes" />
          ) : (
            <Input allowClear={true} defaultValue={inputProps.defaultValue} />
          )}
        </div>
      </Form.Item>
    );
  }

  return (
    <div className="account-details-container">
      <h1>Account Details</h1>
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        initialValues={props}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Row gutter={12}>
          <Col span={12}>
            <InputWrapper
              label="First Name"
              name="firstName"
              defaultValue={props.firstName}
              rules={InputRules.firstName}
              isPassword={false}
            />
          </Col>
          <Col span={12}>
            <InputWrapper
              label="Last Name"
              name="lastName"
              defaultValue={props.lastName}
              rules={InputRules.lastName}
              isPassword={false}
            />
          </Col>
        </Row>
        <InputWrapper
          label="Username"
          name="username"
          defaultValue={props.username}
          rules={InputRules.username}
          isPassword={false}
        />
        <InputWrapper
          label="Email"
          name="email"
          defaultValue={props.email}
          rules={InputRules.email}
          isPassword={false}
        />
        <InputWrapper
          label="Password"
          name="password"
          defaultValue={''}
          rules={InputRules.password}
          isPassword={true}
        />

        <Form.Item noStyle={true}>
          <Button className="save-button" size="large" shape="round" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
