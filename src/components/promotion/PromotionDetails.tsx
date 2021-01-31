import './PromotionDetails.css';

import { ClockCircleOutlined, HeartOutlined } from '@ant-design/icons';
import { Col, Row, Typography } from 'antd';
import React, { CSSProperties, ReactElement } from 'react';

import { Promotion } from '../../types/promotion';

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
    fontFamily: 'ABeeZee',
    fontSize: '1em',
    lineHeight: '1em',
    paddingBottom: 5,
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
}: Promotion): ReactElement {
  /**
   * Returns display text for age of promotion.
   *
   * - If dateAdded < 1 day, displays "X hours ago"
   * - If 1 day <= dateAdded < 1 week, displays "X days ago"
   * - If 1 week <= dateAdded < 1 month, displays "X weeks ago"
   * - If 1 month <= dateAdded < 1 year, displays "X months ago"
   * - If 1 year <= dateAdded, displays "X years ago"
   */
  const promotionAge = (dateAdded: string) => {
    const oneDayInMs = 24 * 60 * 60 * 1000;
    const msElapsed = new Date().getTime() - new Date(dateAdded).getTime();
    const daysAgo = msElapsed / oneDayInMs;

    if (daysAgo < 1) {
      const oneHourInMs = oneDayInMs / 24;
      const hoursAgo = msElapsed / oneHourInMs;
      if (hoursAgo === 1) {
        return '1 hour ago';
      }
      return `${hoursAgo.toFixed(0)} hours ago`;
    } else if (daysAgo < 7) {
      if (daysAgo === 1) {
        return '1 day ago';
      }
      return `${oneDayInMs.toFixed(0)} days ago`;
    } else if (daysAgo < 30) {
      const oneWeekInMs = oneDayInMs * 7;
      const weeksAgo = msElapsed / oneWeekInMs;
      if (weeksAgo === 1) {
        return '1 week ago';
      }
      return `${weeksAgo.toFixed(0)} weeks ago`;
    } else if (daysAgo < 365) {
      const oneMonthInMs = oneDayInMs * 30;
      const monthsAgo = msElapsed / oneMonthInMs;
      if (monthsAgo === 1) {
        return '1 month ago';
      }
      return `${monthsAgo.toFixed(0)} months ago`;
    } else if (daysAgo >= 365) {
      const oneYearInMs = oneDayInMs * 365;
      const yearsAgo = msElapsed / oneYearInMs;
      if (yearsAgo === 1) {
        return '1 year ago';
      }
      return `${yearsAgo.toFixed(0)} years ago`;
    }
  };

  const Info = () => (
    <>
      <Row style={styles.header}>
        <Col span={22}>
          <Title style={styles.promotionName}>{name}</Title>
        </Col>
        <Col span={2}>
          <HeartOutlined style={styles.heart} />
        </Col>
      </Row>
      <Row>
        <Title style={styles.restaurantName}>{restaurantName}</Title>
      </Row>
      <Row>
        <Text className="promotion-description">{description}</Text>
      </Row>
    </>
  );

  const Schedule = () => (
    <Row style={styles.scheduleContainer}>
      <Col span={2}>
        <ClockCircleOutlined style={{ fontSize: '1em', ...styles.schedule }} />
      </Col>
      <Col span={22}>
        <Row>
          <Text style={styles.schedule}>Tuesday: 10 AM - Late</Text>
        </Row>
        <Row>
          <Text style={styles.schedule}>Wednesday: 7 PM - Late</Text>
        </Row>
      </Col>
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
