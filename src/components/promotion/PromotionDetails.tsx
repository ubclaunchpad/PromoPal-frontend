import './PromotionDetails.css';

import { ClockCircleOutlined, DeleteOutlined, HeartFilled, HeartOutlined } from '@ant-design/icons';
import { Button, Col, Row, Typography } from 'antd';
import { formatDistanceToNow } from 'date-fns';
import parse from 'html-react-parser';
import React, { CSSProperties, ReactElement } from 'react';

import { Schedule } from '../../types/promotion';

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
  trashIcon: {
    fontSize: '1.5em',
  },
};

interface Props {
  dateAdded: string;
  description: string;
  expirationDate: string;
  liked: boolean;
  id: string;
  name: string;
  restaurantName: string;
  schedules: Schedule[];

  onDeleteButtonClick?: () => void;
  onLikeButtonClick: () => void;

  boldName?: string;
  boldDescription?: string;
}

export default function PromotionDetails(props: Props): ReactElement {
  /**
   * Returns display text for age of promotion.
   */
  const promotionAge = (dateAdded: string): string => {
    return formatDistanceToNow(new Date(dateAdded), { addSuffix: true });
  };

  const displaySchedules = (schedules: Schedule[]): ReactElement[] => {
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

    return schedules?.map(({ dayOfWeek, startTime, endTime }, index) => (
      <Row key={index}>
        <Text style={styles.schedule}>
          {dayOfWeek}: {formatTime(startTime) + ' - ' + formatTime(endTime)}
        </Text>
      </Row>
    ));
  };

  const Info = (): ReactElement => {
    const likeIcon = (
      <Button
        type="link"
        icon={
          props.liked ? (
            <HeartFilled className="heart-icon-filled" style={styles.heart} />
          ) : (
            <HeartOutlined className="heart-icon-outlined" style={styles.heart} />
          )
        }
        onClick={props.onLikeButtonClick}
      />
    );

    const deleteIcon = props.onDeleteButtonClick && (
      <Button
        type="link"
        icon={<DeleteOutlined className="trash-icon" style={styles.trashIcon} />}
        onClick={props.onDeleteButtonClick}
      />
    );

    return (
      <>
        <Row style={styles.header}>
          <Col span={22}>
            <Title style={styles.promotionName}>
              {props.boldName ? parse(props.boldName) : props.name}
            </Title>
          </Col>
          <Col span={2}>
            {likeIcon}
            {deleteIcon}
          </Col>
        </Row>
        <Row>
          <Title style={styles.restaurantName}>{props.restaurantName}</Title>
        </Row>
        <Row>
          <Text className="promotion-description">
            {props.boldDescription ? parse(props.boldDescription) : <p>{props.description}</p>}
          </Text>
        </Row>
      </>
    );
  };

  const Schedule = (): ReactElement => (
    <Row style={styles.scheduleContainer}>
      <Col span={2}>
        <ClockCircleOutlined style={styles.schedule} />
      </Col>
      <Col span={22}>{displaySchedules(props.schedules)}</Col>
    </Row>
  );

  const Footer = (): ReactElement => (
    <Row justify="space-between">
      <Col>
        <Text style={styles.footer}>Expires</Text>
        <Text strong style={styles.footer}>
          {` ${new Date(props.expirationDate).toDateString()}`}
        </Text>
      </Col>
      <Col>
        <Text style={styles.footer}>{promotionAge(props.dateAdded)}</Text>
      </Col>
    </Row>
  );

  return (
    <Col className="promotion-details" style={styles.detailsContainer}>
      <Info />
      <Schedule />
      <Footer />
    </Col>
  );
}
