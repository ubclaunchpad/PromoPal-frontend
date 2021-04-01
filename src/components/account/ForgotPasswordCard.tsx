import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Form, Input, Tooltip } from 'antd';
import React, { CSSProperties, ReactElement } from 'react';

import { useFirebase } from '../../contexts/FirebaseContext';
import { InputRules } from '../../types/rules';

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

export default function ForgotPasswordCard(props: Props): ReactElement {
  const firebase = useFirebase();

  const onFinish = (data: { email: string }): void => {
    firebase.doPasswordReset(data.email);
    // TODO: https://promopal.atlassian.net/browse/PP-80
    alert('A password reset email has been sent if an account with the email exists');
  };

  const onFinishFailed = (): void => {
    // TODO: https://promopal.atlassian.net/browse/PP-80
    alert('Please submit the form after filling out all fields.');
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
        style={styles.inputWrapper}
        name="email"
        rules={InputRules.email}
        hasFeedback={true}
      >
        <Input placeholder="Email" />
      </Form.Item>
      <Form.Item>
        <Button className="button" style={styles.button} htmlType="submit">
          Reset my password
        </Button>
      </Form.Item>
    </Form>
  );
}
