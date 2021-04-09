import './DeleteModal.less';

import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import React, { ReactElement, useState } from 'react';

interface Props {
  description: ReactElement | string;
  isVisible: boolean;
  title: string;

  onCancel: () => void;
  onOk: () => Promise<void>;
}

export default function DeleteModal(props: Props): ReactElement {
  const [hasError, setHasError] = useState<boolean>(false);

  const buttonProps = { danger: true };

  /**
   * If an error occurs when props.onOk() is called, sets hasError to true.
   */
  const onOkWrapper = async (): Promise<void> => {
    return props.onOk().catch(() => setHasError(true));
  };

  /**
   * Sets hasError to false so that subsequent openings of the modal will not display the error message.
   */
  const afterClose = (): void => {
    setHasError(false);
  };

  const title = (
    <span className="modal-title">
      <ExclamationCircleOutlined className="icon-exclamation" />
      <h3>{props.title}</h3>
    </span>
  );

  return (
    <Modal
      className="modal-border-round"
      okText="Delete"
      closable={false}
      maskClosable={true}
      cancelButtonProps={buttonProps}
      okButtonProps={buttonProps}
      title={title}
      visible={props.isVisible}
      afterClose={afterClose}
      onCancel={props.onCancel}
      onOk={onOkWrapper}
    >
      {props.description}
      {hasError && <p className="error-text">An error occurred. Please try again later.</p>}
    </Modal>
  );
}
