import './PromotionsTab.less';

import { ClockCircleOutlined } from '@ant-design/icons';
import { Col, Row, Tabs } from 'antd';
import React, { ReactElement, useEffect, useState } from 'react';

import RestaurantService from '../../../../services/RestaurantService';
import { Promotion } from '../../../../types/promotion';
import { formatTime } from '../../../../utils/time';

const { TabPane } = Tabs;

/**
 * The order of the days of the week.
 */
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface DayToPromotions {
  [day: string]: Promotion[];
}

interface Props {
  restaurantId: string;
}

export default function PromotionsTab(props: Props): ReactElement {
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  /**
   * Produces an object that maps days to the promotions that occur on those days.
   *
   * @param promotions - The list of promotions to sort
   */
  const mapPromotionsToDays = (promotions: Promotion[]): DayToPromotions => {
    const daysToPromotions: DayToPromotions = {
      Sun: [],
      Mon: [],
      Tue: [],
      Wed: [],
      Thu: [],
      Fri: [],
      Sat: [],
    };
    promotions.forEach((promotion) => {
      promotion.schedules.forEach(({ dayOfWeek }) => {
        const abbreviation =
          dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1, 3).toLowerCase();
        const promos = daysToPromotions[abbreviation];
        promos.push(promotion);
        daysToPromotions[abbreviation] = promos;
      });
    });
    return daysToPromotions;
  };

  /**
   * Fetches restaurant's promotions.
   */
  useEffect(() => {
    RestaurantService.getRestaurantPromotions(props.restaurantId)
      .then((promotions: Promotion[]) => setPromotions(promotions))
      .catch(() => setPromotions([]));
  }, [props.restaurantId]);

  return (
    <Tabs className="promotions-tab" defaultActiveKey="Sun" size="small">
      {DAYS.map((day) => {
        const restaurantPromotions = mapPromotionsToDays(promotions)[day];
        return (
          <TabPane tab={day} key={day}>
            {restaurantPromotions.length > 0 ? (
              restaurantPromotions.map((promotion) => (
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
              ))
            ) : (
              <p className="schedules schedules-empty">No promotions for this day!</p>
            )}
          </TabPane>
        );
      })}
    </Tabs>
  );
}
