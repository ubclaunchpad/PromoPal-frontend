import './AccountDetails.css';

import { Button, Col, Form, Input, Row } from 'antd';
import { Rule } from 'antd/lib/form';
import React, { ReactElement } from 'react';

import UserService from '../../services/UserService';
import { User } from '../../types/user';

interface InputProps {
  defaultValue: string;
  label: string;
  name: string;
  rules: Rule[];
}

interface Props {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
}

export default function AccountDetails(props: Props): ReactElement {
  const [form] = Form.useForm();

  /**
   * A mapping from inputs to validation rules.
   */
  const rules: { [name: string]: Rule[] } = {
    email: [
      {
        pattern: /^[+\w\d._-]+@[a-zA-Z_]+\.[a-zA-Z]+/,
        message: 'E-mail is incorrectly formatted!',
      },
      {
        required: true,
        message: 'Email is required!',
      },
      {
        whitespace: true,
        message: 'Email cannot be empty!',
      },
    ],
    firstName: [
      { required: true, message: 'First name is required!' },
      { whitespace: true, message: 'First name cannot be empty!' },
    ],
    lastName: [
      { required: true, message: 'Last name is required!' },
      { whitespace: true, message: 'Last name cannot be empty!' },
    ],
    username: [
      { required: true, message: 'Username is required!' },
      { whitespace: true, message: 'Username cannot be empty!' },
    ],
  };

  /**
   * On form submit, validates all inputs and sends the request to update the user on the BE.
   *
   * @param values - The updated values on the BE
   */
  const onSubmitForm = (values: { [label: string]: string | undefined }) => {
    const inputFields = ['firstName', 'lastName', 'username', 'email'];
    form.validateFields(inputFields);

    const updatedValues: Partial<User> = Object.entries(values).reduce<{ [label: string]: string }>(
      (acc, [entry, value]) => {
        if (value) {
          acc[entry] = value;
        }
        return acc;
      },
      {}
    );
    if (Object.keys(updatedValues).length > 0) {
      // TODO: https://promopal.atlassian.net/browse/PP-80
      return UserService.updateUser(updatedValues);
    }
  };

  function InputWrapper(inputProps: InputProps): ReactElement {
    return (
      <Form.Item name={inputProps.name} rules={inputProps.rules}>
        <div className="input-wrapper">
          <p className="input-label">{inputProps.label}</p>
          <Input allowClear={true} defaultValue={inputProps.defaultValue} />
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
        onFinish={onSubmitForm}
      >
        <Row gutter={12}>
          <Col span={12}>
            <InputWrapper
              label="First Name"
              name="firstName"
              defaultValue={props.firstName}
              rules={rules.firstName}
            />
          </Col>
          <Col span={12}>
            <InputWrapper
              label="Last Name"
              name="lastName"
              defaultValue={props.lastName}
              rules={rules.lastName}
            />
          </Col>
        </Row>
        <InputWrapper
          label="Username"
          name="username"
          defaultValue={props.username}
          rules={rules.username}
        />
        <InputWrapper label="Email" name="email" defaultValue={props.email} rules={rules.email} />

        <Form.Item noStyle={true}>
          <Button className="save-button" size="large" shape="round" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
