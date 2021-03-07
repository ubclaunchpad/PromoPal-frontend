import { ArrowRightOutlined } from '@ant-design/icons';
import { Checkbox, Col, Row, TimePicker } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import React, { ReactElement } from 'react';

import EnumService from '../../services/EnumService';
import { abbreviate } from '../../utils/date';

interface Props {
  onDaySelected: (event: CheckboxChangeEvent) => void;
  onTimeChange: (type: 'start' | 'end', day: string, time: unknown) => void;
}

export default function PromotionTime(props: Props): ReactElement {
  return (
    <Checkbox.Group>
      {EnumService.daysOfWeek.map((day, index) => (
        <Row key={index}>
          <Col span={4}>
            <Checkbox value={day} onChange={props.onDaySelected}>
              {abbreviate(day)}
            </Checkbox>
          </Col>
          <Col>
            <Row gutter={16} align="middle" justify="space-between">
              <Col>
                <TimePicker
                  allowClear={true}
                  showNow={false}
                  use12Hours={true}
                  minuteStep={15}
                  format="h:mm a"
                  placeholder="Start time"
                  onSelect={(time: unknown): void => props.onTimeChange('start', day, time)}
                />
              </Col>
              <Col>
                <ArrowRightOutlined />
              </Col>
              <Col>
                <TimePicker
                  allowClear={true}
                  showNow={false}
                  use12Hours={true}
                  minuteStep={15}
                  format="h:mm a"
                  placeholder="End time"
                  onSelect={(time: unknown): void => props.onTimeChange('end', day, time)}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      ))}
    </Checkbox.Group>
  );
}
