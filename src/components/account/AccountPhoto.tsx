import { UserOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import React, { CSSProperties, ReactElement } from 'react';

const styles: { [identifier: string]: CSSProperties } = {
  container: {
    alignItems: 'center',
    color: '#333',
    display: 'flex',
    flexDirection: 'column',
    margin: 10,
    paddingTop: 30,
    paddingBottom: 30,
  },
  button: {
    backgroundColor: '#FFC529',
    fontWeight: 'bold',
    marginTop: 10,
  },
  deleteAccount: {
    marginTop: 10,
    textDecoration: 'underline',
  },
};

export default function AccountPhoto(): ReactElement {
  const handleClick = () => {
    alert('Click');
  };

  return (
    <div style={styles.container}>
      <Avatar size={128} icon={<UserOutlined />} />
      <Button size="large" shape="round" onClick={handleClick} style={styles.button}>
        Update Photo
      </Button>
      <p style={styles.deleteAccount}>Delete Account</p>
    </div>
  );
}
