import './Button.less';

import { Button as AntButton } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import React, { ReactElement } from 'react';

import { className } from '../../utils/component';

interface Props {
  shape?: 'circle' | 'round';
  size?: 'small' | 'middle' | 'large';
  text?: string;
  type?: 'primary';
}

export default function Button(props: Props & ButtonProps): ReactElement {
  return (
    <AntButton
      {...props}
      className={className({ 'button-primary': props.type === 'primary' }, 'button')}
      shape={props.shape}
      size={props.size}
      onClick={props.onClick}
    >
      {props.text ? <div className="button-text">{props.text}</div> : props.children}
    </AntButton>
  );
}

Button.defaultProps = {
  shape: 'round',
  size: 'middle',
  type: 'primary',
};
