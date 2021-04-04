import './Dropdown.less';

import { DownOutlined } from '@ant-design/icons';
import { Checkbox, Col, Dropdown as AntDropdown, Row } from 'antd';
import React, { ReactElement, useCallback, useEffect, useState } from 'react';

import { DispatchAction, useDropdown } from '../../contexts/DropdownContext';
import { Dropdown as DropdownType, DropdownAction } from '../../types/dropdown';
import { className } from '../../utils/component';

/**
 * @component DropdownMultiSelect
 * This component should be used when the user should be allowed to select > 1 option.
 *
 * @param text The text to display on the dropdown button
 * @param options The list of options for this dropdown
 */
export default function DropdownMultiSelect({ text, options }: DropdownType): ReactElement {
  /**
   * The list of keys of the selected options
   */
  const [selectedKeys, changeSelectedKeys] = useState<string[]>([]);

  /**
   * Whether the options are visible; needed to override the default behaviour of closing upon select
   */
  const [visible, setVisible] = useState<boolean>(false);

  const { dispatch } = useDropdown();

  /**
   * Adds or removes key to selectedKeys array and performs the given action
   */
  const onClickHandler = useCallback(
    (action: DropdownAction, text: string) => {
      let newSelectedKeys = [];
      const textIndex = selectedKeys.indexOf(text);
      if (textIndex >= 0) {
        selectedKeys.splice(textIndex, 1);
        newSelectedKeys = selectedKeys;
      } else {
        newSelectedKeys = [...selectedKeys, text];
      }
      changeSelectedKeys(newSelectedKeys);
      action(newSelectedKeys);
    },
    [selectedKeys]
  );

  /**
   * On component mount, add reset callback to dropdown state
   */
  useEffect(() => {
    dispatch({
      type: DispatchAction.ADD_RESET_CALLBACK,
      payload: { resetCallback: () => changeSelectedKeys([]) },
    });
  }, [dispatch]);

  const dropdownOptions = (
    <Col className="dropdown-menu">
      {options.map(({ action, text }, index) => (
        <Row className="dropdown-option-multi" align="middle" key={index}>
          <Checkbox
            className="dropdown-checkbox"
            onClick={() => onClickHandler(action, text)}
            checked={selectedKeys.includes(text)}
          >
            <Col className="dropdown-option">{text}</Col>
          </Checkbox>
        </Row>
      ))}
    </Col>
  );

  return (
    <AntDropdown
      overlay={dropdownOptions}
      onVisibleChange={(flag: boolean) => setVisible(flag)}
      visible={visible}
    >
      <div
        className={className(
          { 'dropdown-button--active': selectedKeys.length > 0 },
          'dropdown-button'
        )}
      >
        {text} <DownOutlined />
      </div>
    </AntDropdown>
  );
}
