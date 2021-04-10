import './Dropdown.less';

import { DownOutlined } from '@ant-design/icons';
import { Col, Dropdown, Radio } from 'antd';
import React, { ReactElement, useCallback, useEffect, useState } from 'react';

import { DispatchAction, useDropdown } from '../../contexts/DropdownContext';
import { DropdownAction, DropdownOption } from '../../types/dropdown';
import { className } from '../../utils/component';

const { Group } = Radio;

interface Props {
  options: DropdownOption[];
  text: string;

  defaultValue?: string;
}

/**
 * @component DropdownSelect
 * This component should be used when the user should only be allowed to select up to 1 option.
 *
 */
export default function DropdownSelect(props: Props): ReactElement {
  /**
   * The key of the currently selected option
   */
  const [activeKey, setActiveKey] = useState<string>('');

  const { dispatch } = useDropdown();

  /**
   * Sets activeKey for this dropdown and performs given action
   */
  const onClickHandler = useCallback((action: DropdownAction, text: string) => {
    setActiveKey(text);
    action(text);
  }, []);

  /**
   * On component mount, add reset callback to dropdown state
   */
  useEffect(() => {
    dispatch({
      type: DispatchAction.ADD_RESET_CALLBACK,
      payload: { resetCallback: () => setActiveKey('') },
    });
  }, [dispatch]);

  const dropdownOptions = (): ReactElement => (
    <Col className="dropdown-menu">
      <Group name={props.text} defaultValue={props.defaultValue}>
        {props.options.map(({ action, description, text }, index) => (
          <Col
            className="dropdown-option-radio"
            key={index}
            style={{ height: description ? 50 : 30 }}
          >
            <Radio
              className="dropdown-radio"
              value={text}
              onClick={() => onClickHandler(action, text)}
            >
              <Col
                className={className(
                  { 'dropdown-option-text--large': !!description },
                  'dropdown-option'
                )}
              >
                {text}
              </Col>
              {description && <Col className="dropdown-option-description">{description}</Col>}
            </Radio>
          </Col>
        ))}
      </Group>
    </Col>
  );

  return (
    <Dropdown overlay={dropdownOptions}>
      <div className={className({ 'dropdown-button--active': !!activeKey }, 'dropdown-button')}>
        {activeKey ? `${props.text}: ${activeKey}` : props.text} <DownOutlined />
      </div>
    </Dropdown>
  );
}
