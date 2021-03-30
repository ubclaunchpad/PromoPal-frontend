import { Select } from 'antd';
import React, { ReactElement } from 'react';

interface Props {
  options: Array<{ value: string }>;
  placeholder: string;

  allowClear?: boolean;
}

export default function MultipleSelect(props: Props): ReactElement {
  return (
    <Select
      mode="multiple"
      showArrow={true}
      allowClear={props.allowClear}
      placeholder={props.placeholder}
    >
      {props.options.map(({ value }, index) => (
        <Select.Option key={index} value={value}>
          {value}
        </Select.Option>
      ))}
    </Select>
  );
}
