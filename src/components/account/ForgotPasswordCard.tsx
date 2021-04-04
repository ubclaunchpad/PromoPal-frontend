import './ForgotPasswordCard.less';

import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Form, Input, Tooltip } from 'antd';
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
  onClickBack: () => void;
}

export default function ForgotPasswordCard(props: Props): ReactElement {
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
      <Tooltip title="Back">
        <Button shape="circle" onClick={props.onClickBack} icon={<ArrowLeftOutlined />} />
      </Tooltip>
      <h1>Reset your password</h1>
      <p>Please enter your email to reset your password.</p>
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
      <Form.Item>
        <Button className="button reset-password-button" htmlType="submit">
          Reset my password
        </Button>
      </Form.Item>
    </Form>
  );
}
