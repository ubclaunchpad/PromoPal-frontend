import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Form, Input, Tooltip } from 'antd';
import React, { CSSProperties, ReactElement } from 'react';
import { useHistory } from 'react-router-dom';

import { useFirebase } from '../../contexts/FirebaseContext';
import RegistrationService from '../../services/RegistrationService';
import { RegistrationData } from '../../types/user';

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
  const firebase = useFirebase();
  const history = useHistory();

  const onFinish = (data: RegistrationData) => {
    RegistrationService.register(firebase, data)
      .then(() => {
        history.push('/');
      })
      .catch((err: Error) => {
        // TODO: https://promopal.atlassian.net/browse/PP-80
        alert(err.message);
      });
  };

  const onFinishFailed = () => {
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
      <Form.Item style={{ marginBottom: 0 }}>
        <Form.Item
          name="firstName"
          rules={[{ required: true, message: 'Please enter your first name.' }]}
          style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
          hasFeedback={true}
        >
          <Input placeholder="First name" />
        </Form.Item>
        <Form.Item
          name="lastName"
          rules={[{ required: true, message: 'Please enter your last name.' }]}
          style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
          hasFeedback={true}
        >
          <Input placeholder="Last name" />
        </Form.Item>
      </Form.Item>

      <Form.Item
        style={styles.inputWrapper}
        name="userName"
        rules={[{ required: true, message: 'A username is required.' }]}
        hasFeedback={true}
      >
        <Input placeholder="Username" />
      </Form.Item>
      <Form.Item
        style={styles.inputWrapper}
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
        style={styles.inputWrapper}
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
