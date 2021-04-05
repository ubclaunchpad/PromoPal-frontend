import './PromotionDetails.less';

import { ClockCircleOutlined, DeleteOutlined, HeartFilled, HeartOutlined } from '@ant-design/icons';
import { Button, Col, Row, Typography } from 'antd';
import { formatDistanceToNow } from 'date-fns';
import parse from 'html-react-parser';
import React, { MouseEvent, ReactElement } from 'react';

import { Schedule } from '../../types/promotion';
import { formatTime } from '../../utils/time';

const { Title, Text } = Typography;

interface Props {
  dateAdded: string;
  description: string;
  expirationDate: string;
  id: string;
  isSavedByUser: boolean;
  name: string;
  restaurantName: string;
  schedules: Schedule[];

  onSaveButtonClick: () => void;

  boldName?: string;
  boldDescription?: string;

  onDeleteButtonClick?: () => void;
}

export default function PromotionDetails(props: Props): ReactElement {
  /**
   * Returns display text for age of promotion.
   */
  const promotionAge = (dateAdded: string): string => {
    return formatDistanceToNow(new Date(dateAdded), { addSuffix: true });
  };

  /**
   * On click handler for "save" button: stops restaurant card from being opened when the save button is pressed.
   *
   * @param event - The event received from the button click
   */
  const onSaveHandler = (event: MouseEvent<HTMLElement>): void => {
    event.stopPropagation();
    props.onSaveButtonClick();
  };

  const displaySchedules = (schedules: Schedule[]): ReactElement[] => {
    return schedules?.map(({ dayOfWeek, startTime, endTime }, index) => (
      <Row key={index}>
        <Text className="schedules">
          {dayOfWeek}: {formatTime(startTime, endTime)}
        </Text>
      </Row>
    ));
  };

  const Info = (): ReactElement => {
    const likeIcon = (
      <Button
        type="link"
        icon={
          props.isSavedByUser ? (
            <HeartFilled className="heart-icon heart-icon-filled" />
          ) : (
            <HeartOutlined className="heart-icon heart-icon-outlined" />
          )
        }
        onClick={onSaveHandler}
      />
    );

    const deleteIcon = props.onDeleteButtonClick && (
      <Button
        type="link"
        icon={<DeleteOutlined className="trash-icon" />}
        onClick={props.onDeleteButtonClick}
      />
    );

    return (
      <>
        <Row className="header">
          <Col span={22}>
            <Title className="promotion-name">
              {props.boldName ? parse(props.boldName) : props.name}
            </Title>
          </Col>
          <Col span={2}>
            {likeIcon}
            {deleteIcon}
          </Col>
        </Row>
        <Row>
          <Title className="restaurant-name">{props.restaurantName}</Title>
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
    <Row className="schedule-container">
      <Col span={2}>
        <ClockCircleOutlined className="schedule-clock" />
      </Col>
      <Col span={22}>{displaySchedules(props.schedules)}</Col>
    </Row>
  );

  const Footer = (): ReactElement => (
    <Row justify="space-between">
      <Col>
        <Text className="footer-text">Expires</Text>
        <Text strong className="footer-text">
          {` ${new Date(props.expirationDate).toDateString()}`}
        </Text>
      </Col>
      <Col>
        <Text className="footer-text">{promotionAge(props.dateAdded)}</Text>
      </Col>
    </Row>
  );

  return (
    <Col className="promotion-details">
      <Info />
      <Schedule />
      <Footer />
    </Col>
  );
}
