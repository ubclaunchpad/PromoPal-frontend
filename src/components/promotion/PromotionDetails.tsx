import './PromotionDetails.css';

import { ClockCircleOutlined, HeartOutlined } from '@ant-design/icons';
import { Col, Row, Typography } from 'antd';
import { formatDistanceToNow } from 'date-fns';
import parse from 'html-react-parser';
import React, { CSSProperties, ReactElement } from 'react';

import { Promotion, Schedule } from '../../types/promotion';

const { Title, Text } = Typography;

const styles: { [identifier: string]: CSSProperties } = {
  detailsContainer: {
    paddingLeft: 10,
    textAlign: 'left',
    width: '100%',
  },
  footer: {
    color: '#8B8888',
    fontSize: '0.8em',
  },
  header: {
    justifyContent: 'space-between',
  },
  heart: {
    fontSize: '1.5em',
  },
  promotionName: {
    fontSize: '1.5em',
    fontWeight: 'normal',
    marginBottom: 0,
  },
  restaurantName: {
    fontSize: '0.9em',
    lineHeight: '0.9em',
    textDecoration: 'underline',
  },
  schedule: {
    color: '#8B8888',
    fontSize: '0.9em',
  },
  scheduleContainer: {
    paddingTop: 10,
    paddingBottom: 10,
  },
};

export default function PromotionDetails({
  name,
  dateAdded,
  description,
  expirationDate,
  restaurantName,
  schedules,
  boldName,
  boldDescription,
}: Promotion): ReactElement {
  /**
   * Returns display text for age of promotion.
   */
  const promotionAge = (dateAdded: string) => {
    return formatDistanceToNow(new Date(dateAdded), { addSuffix: true });
  };

  const displaySchedules = (schedules: Schedule[]) => {
    const formatTime = (startTime: string): string => {
      const [hour, minute] = startTime.split(':');

      const hourNum = parseInt(hour);
      const minuteNum = parseInt(minute);

      let formattedTime = `${hourNum === 12 ? hourNum : hourNum % 12}`;
      if (minuteNum !== 0) {
        formattedTime += `:${minuteNum}`;
      }
      formattedTime += hourNum < 12 ? ' AM' : ' PM';
      return formattedTime;
    };

    return schedules.map(({ dayOfWeek, startTime, endTime }) => (
      <Row>
        <Text style={styles.schedule}>
          {dayOfWeek}: {formatTime(startTime) + ' - ' + formatTime(endTime)}
        </Text>
      </Row>
    ));
  };

  const Info = () => (
    <>
      <Row style={styles.header}>
        <Col span={22}>
          <Title style={styles.promotionName}>{boldName ? parse(boldName) : name}</Title>
        </Col>
        <Col span={2}>
          <HeartOutlined style={styles.heart} />
        </Col>
      </Row>
      <Row>
        <Title style={styles.restaurantName}>{restaurantName}</Title>
      </Row>
      <Row>
        <Text className="promotion-description">
          {boldDescription ? parse(boldDescription) : <p>{description}</p>}
        </Text>
      </Row>
    </>
  );

  const Schedule = () => (
    <Row style={styles.scheduleContainer}>
      <Col span={2}>
        <ClockCircleOutlined style={styles.schedule} />
      </Col>
      <Col span={22}>{displaySchedules(schedules)}</Col>
    </Row>
  );

  const Footer = () => (
    <Row justify="space-between">
      <Col>
        <Text style={styles.footer}>Expires</Text>
        <Text strong style={styles.footer}>
          {` ${new Date(expirationDate).toDateString()}`}
        </Text>
      </Col>
      <Col>
        <Text style={styles.footer}>{promotionAge(dateAdded)}</Text>
      </Col>
    </Row>
  );

  return (
    <Col style={styles.detailsContainer}>
      <Info />
      <Schedule />
      <Footer />
    </Col>
  );
}
