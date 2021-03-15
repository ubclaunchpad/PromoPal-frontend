import './PromotionsTab.css';

import { ClockCircleOutlined } from '@ant-design/icons';
import { Col, Row, Tabs } from 'antd';
import React, { ReactElement } from 'react';

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
   * Orders the (day, promotions) tuples from Sunday to Saturday.
   */
  const getOrderedEntries = (): Array<[string, Promotion[]]> => {
    const order = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const pairs = Object.entries(mapPromotionsToDays(props.promotions));
    return pairs.sort(([a], [b]) => order.indexOf(a) - order.indexOf(b));
  };

  /**
   * Produces an object that maps days to the promotions that occur on those days.
   *
   * @param promotions - The list of promotions to sort
   */
  const mapPromotionsToDays = (promotions: Promotion[]): DayToPromotions => {
    const daysToPromotions: DayToPromotions = {};
    promotions.forEach((promotion) => {
      promotion.schedules.forEach(({ dayOfWeek }) => {
        const abbreviation =
          dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1, 3).toLowerCase();
        const promos = daysToPromotions[abbreviation] || [];
        promos.push(promotion);
        daysToPromotions[abbreviation] = promos;
      });
    });
    return daysToPromotions;
  };

  return (
    <Tabs className="tab-promotions" defaultActiveKey="Sun" size="small">
      {getOrderedEntries().map(([day, promotions]) => (
        <TabPane tab={day} key={day}>
          {promotions.map((promotion) => (
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
