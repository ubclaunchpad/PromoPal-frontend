import './AccountPhoto.less';

import { UserOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import React, { ReactElement } from 'react';

interface Props {
  onDeleteUser: () => void;
}

export default function AccountPhoto(props: Props): ReactElement {
  // TODO: https://promopal.atlassian.net/browse/PP-107
  const showButton = false;

  const handleClick = (): void => {
    alert('Click');
  };

  return (
    <div className="account-photo-container">
      <Avatar size={128} icon={<UserOutlined />} />
      {showButton && (
        <Button size="large" shape="round" onClick={handleClick} className="button">
          Update Photo
        </Button>
      )}
      <Button className="delete-account" onClick={props.onDeleteUser}>
        Delete Account
      </Button>
    </div>
  );
}
