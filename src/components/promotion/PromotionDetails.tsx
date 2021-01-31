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
  description,
  expirationDate,
  restaurantName = 'Restaurant',
}: Promotion): ReactElement {
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
        <Text style={styles.footer}>8 days ago</Text>
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
