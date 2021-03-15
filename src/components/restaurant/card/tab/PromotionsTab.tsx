import './PromotionsTab.css';

import { ClockCircleOutlined } from '@ant-design/icons';
import { Col, Row, Tabs } from 'antd';
import React, { ReactElement, useMemo } from 'react';

import { Promotion } from '../../../../types/promotion';
import { formatTime } from '../../../../utils/time';

const { TabPane } = Tabs;

interface DayToPromotions {
  [day: string]: Promotion[];
}

interface Props {
  promotions: Promotion[];
}

export default function PromotionsTab(props: Props): ReactElement {
  /**
   * Produces an object that maps days to the promotions that occur on those days.
   */
  const daysToPromotions = useMemo((): DayToPromotions => {
    const daysToPromotions: DayToPromotions = {};
    props.promotions.forEach((promotion) => {
      promotion.schedules.forEach(({ dayOfWeek }) => {
        const abbreviation =
          dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1, 3).toLowerCase();
        const promos = daysToPromotions[abbreviation] || [];
        promos.push(promotion);
        daysToPromotions[abbreviation] = promos;
      });
    });
    return daysToPromotions;
  }, [props.promotions]);

  return (
    <Tabs className="tab-promotions" defaultActiveKey="Sun" size="small">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
        <TabPane tab={day} key={day}>
          {daysToPromotions[day].map((promotion) => (
            <Row className="promotion-info">
              <Col span={2}>
                <ClockCircleOutlined className="clock-icon" />
              </Col>
              <Col span={22}>
                <div className="schedules">
                  {promotion.schedules.map(({ startTime, endTime }) => (
                    <p className="schedules-time">{formatTime(startTime, endTime)}</p>
                  ))}
                  <p className="description">{promotion.description}</p>
                  <div className="expiration-date">
                    <p>{`Expires ${new Date(promotion.expirationDate).toDateString()}`}</p>
                  </div>
                </div>
              </Col>
            </Row>
          ))}
        </TabPane>
      ))}
    </Tabs>
  );
}
