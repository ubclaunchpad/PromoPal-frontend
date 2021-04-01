import './Dropdown.css';

import { DownOutlined } from '@ant-design/icons';
import { Col, Dropdown, Radio } from 'antd';
import React, { CSSProperties, ReactElement, useCallback, useEffect, useState } from 'react';

import { DispatchAction, useDropdown } from '../../contexts/DropdownContext';
import { DropdownAction, DropdownOption } from '../../types/dropdown';

const { Group } = Radio;

const styles: { [identifier: string]: CSSProperties } = {
  active: {
    backgroundColor: '#FFC529',
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 20,
    boxShadow: '0 2px 10px 0px #1A333333',
    color: 'black',
    fontWeight: 'bold',
    marginLeft: 10,
    marginRight: 10,
    padding: 8,
    paddingLeft: 15,
    paddingRight: 15,
  },
  largeText: {
    fontSize: '1.1em',
  },
  menu: {
    backgroundColor: '#fff',
    borderRadius: 20,
    maxHeight: '80vh',
    overflow: 'scroll',
    paddingTop: 15,
    paddingBottom: 15,
  },
  option: {
    display: 'inline',
    top: 2,
  },
  optionDescription: {
    fontSize: '0.8em',
    marginLeft: 25,
    color: 'gray',
  },
  radio: {
    margin: 0,
    paddingLeft: 10,
    paddingRight: 10,
    width: '100%',
  },
};

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

  const dropdownButtonStyle = {
    ...styles.button,
    ...(activeKey && styles.active),
  };

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
    <Col style={styles.menu}>
      <Group name={props.text} defaultValue={props.defaultValue}>
        {props.options.map(({ action, description, text }, index) => (
          <Col
            className="dropdown-option-multi"
            key={index}
            style={{ height: description ? 50 : 30 }}
          >
            <Radio style={styles.radio} value={text} onClick={() => onClickHandler(action, text)}>
              <Col
                style={{
                  ...styles.option,
                  ...(description && styles.largeText),
                }}
              >
                {text}
              </Col>
              {description && <Col style={styles.optionDescription}>{description}</Col>}
            </Radio>
          </Col>
        ))}
      </Group>
    </Col>
  );

  return (
    <Dropdown overlay={dropdownOptions}>
      <div style={dropdownButtonStyle}>
        {props.text} <DownOutlined />
      </div>
    </Dropdown>
  );
}
