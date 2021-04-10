import './PromotionDetails.less';

import { ClockCircleOutlined, DeleteOutlined, HeartFilled, HeartOutlined } from '@ant-design/icons';
import { Button, Col, Row, Typography } from 'antd';
import parse from 'html-react-parser';
import React, { MouseEvent, ReactElement } from 'react';

import { useAuthUser } from '../../contexts/AuthUserContext';
import { Schedule, VoteState } from '../../types/promotion';
import { formatTime } from '../../utils/time';
import Votes from './Votes';

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
  votes: number;
  voteState: VoteState;

  onDownvoteClick: () => void;
  onSaveButtonClick: () => void;
  onUpvoteClick: () => void;

  boldName?: string;
  boldDescription?: string;

  onDeleteButtonClick?: () => void;
}

export default function PromotionDetails(props: Props): ReactElement {
  const authUser = useAuthUser();

  /**
   * On click handler for "save" button: stops restaurant card from being opened when the save button is pressed.
   *
   * @param event - The event received from the button click
   */
  const onSaveHandler = (event: MouseEvent<HTMLElement>): void => {
    event.stopPropagation();
    props.onSaveButtonClick();
  };

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

  const deleteIcon = (
    <Button
      type="link"
      icon={<DeleteOutlined className="trash-icon" />}
      onClick={props.onDeleteButtonClick}
    />
  );

  const displaySchedules = (schedules: Schedule[]): ReactElement[] => {
    return schedules?.map(({ dayOfWeek, startTime, endTime }, index) => (
      <Row key={index}>
        <Text className="schedules">
          {dayOfWeek}: {formatTime(startTime, endTime)}
        </Text>
      </Row>
    ));
  };

  return (
    <Row className="promotion-details" gutter={2} justify="space-between">
      <Col span={authUser ? 22 : 24}>
        <Row>
          <Title className="promotion-name">
            {props.boldName ? parse(props.boldName) : props.name}
          </Title>
        </Row>
        <Row>
          <Text className="promotion-description">
            {props.boldDescription ? parse(props.boldDescription) : props.description}
          </Text>
        </Row>

        <Row className="schedule-container">
          <ClockCircleOutlined className="schedule-clock" />
          <div className="schedule-times-container">{displaySchedules(props.schedules)}</div>
        </Row>

        <Row>
          <Text className="footer-text">
            Expires<b>{` ${new Date(props.expirationDate).toDateString()}`}</b>
          </Text>
        </Row>
      </Col>
      {authUser && (
        <Col span={2} className="sidebar-buttons">
          <Votes
            votes={props.votes}
            voteState={props.voteState}
            onDownvoteClick={props.onDownvoteClick}
            onUpvoteClick={props.onUpvoteClick}
          />
          {likeIcon}
          {props.onDeleteButtonClick && deleteIcon}
        </Col>
      )}
    </Row>
  );
}
