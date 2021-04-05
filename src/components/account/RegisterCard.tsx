import './RegisterCard.less';

import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Tooltip } from 'antd';
import React, { ReactElement } from 'react';

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
  const onFinish = (): void => {
    alert('Finish');
    //console.log('Success:', values);
    // TODO https://promopal.atlassian.net/jira/software/projects/PP/boards/1?selectedIssue=PP-35
    // TODO https://promopal.atlassian.net/jira/software/projects/PP/boards/1?selectedIssue=PP-37
  };

  const onFinishFailed = (): void => {
    //console.log('Failed:', errorInfo);
    // TODO https://promopal.atlassian.net/jira/software/projects/PP/boards/1?selectedIssue=PP-38
  };

  return (
    <Form
      {...layout}
      name="registerCard"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Tooltip className="back-button" title="Back">
        <Button shape="circle" onClick={props.onClickBack} icon={<ArrowLeftOutlined />} />
      </Tooltip>

      <h1 className="register-account-title">Create an account</h1>
      <p>Create an account to upload promotions and save deals you like.</p>

      <Row gutter={6} style={{ marginBottom: 5 }}>
        <Col span={12}>
          <Form.Item
            name="firstname"
            rules={[{ required: true, message: 'Please enter your first name.' }]}
            hasFeedback={true}
          >
            <Input placeholder="First name" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="lastname"
            rules={[{ required: true, message: 'Please enter your last name.' }]}
            hasFeedback={true}
          >
            <Input placeholder="Last name" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        className="input-wrapper"
        name="username"
        rules={[{ required: true, message: 'A username is required.' }]}
        hasFeedback={true}
      >
        <Input placeholder="Username" />
      </Form.Item>

      <Form.Item
        className="input-wrapper"
        name="email"
        rules={[
          { required: true, message: 'An email is required.' },
          { type: 'email', message: 'The input is not a valid email.' },
        ]}
        hasFeedback={true}
      >
        <Input placeholder="Email" />
      </Form.Item>

      <Form.Item
        className="input-wrapper"
        name="password"
        rules={[
          { required: true, message: 'A password is required.' },
          { min: 9, message: 'Passwords must be at least 9 characters.' },
        ]}
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
        <Button className="button register-button" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
  );
}
