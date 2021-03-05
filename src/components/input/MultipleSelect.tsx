import { Select } from 'antd';
import React, { ReactElement } from 'react';

type OptionType = {
  value: string;
};

export default function MultipleSelect({
  placeholder,
  options,
}: {
  placeholder: string;
  options: OptionType[];
}): ReactElement {
  return (
    <Select showArrow mode="multiple" placeholder={placeholder}>
      {options.map(({ value }: OptionType, index: number) => (
        <Select.Option key={index} value={value}>
          {value}
        </Select.Option>
      ))}
    </Select>
  );
}
