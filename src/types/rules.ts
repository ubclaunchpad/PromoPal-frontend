import { Rule } from 'antd/lib/form';

/**
 * A mapping from inputs to validation rules.
 */
export const InputRules: { [name: string]: Rule[] } = {
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
  password: [
    { required: true, message: 'Please input your password!' },
    { min: 9, message: 'Passwords must be at least 9 characters.' },
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
