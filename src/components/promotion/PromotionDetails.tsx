import './PromotionDetails.less';

import { ClockCircleOutlined, DeleteOutlined, HeartFilled, HeartOutlined } from '@ant-design/icons';
import { Button, Col, Row, Typography } from 'antd';
import { formatDistanceToNow } from 'date-fns';
import parse from 'html-react-parser';
import React, { CSSProperties, MouseEvent, ReactElement } from 'react';

import { Schedule, VoteState } from '../../types/promotion';
import { formatTime } from '../../utils/time';
import Votes from './Votes';

const { Title, Text } = Typography;

const styles: { [identifier: string]: CSSProperties } = {
  detailsContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    textAlign: 'left',
    width: '100%',
  },
  footer: {
    color: '#8B8888',
    fontSize: '0.8em',
    lineHeight: '1.2rem',
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
  rightHand: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
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
  /**
   * Returns display text for age of promotion.
   */
  const promotionAge = (dateAdded: string): string => {
    const distance = formatDistanceToNow(new Date(dateAdded), { addSuffix: true });
    return `Posted ${distance}`;
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

  const likeIcon = (
    <Button
      type="link"
      icon={
        props.isSavedByUser ? (
          <HeartFilled className="heart-icon-filled" style={styles.heart} />
        ) : (
          <HeartOutlined className="heart-icon-outlined" style={styles.heart} />
        )
      }
      onClick={onSaveHandler}
    />
  );

  const deleteIcon = (
    <Button
      type="link"
      icon={<DeleteOutlined className="trash-icon" style={styles.trashIcon} />}
      onClick={props.onDeleteButtonClick}
    />
  );

  const displaySchedules = (schedules: Schedule[]): ReactElement[] => {
    return schedules?.map(({ dayOfWeek, startTime, endTime }, index) => (
      <Row key={index}>
        <Text style={styles.schedule}>
          {dayOfWeek}: {formatTime(startTime, endTime)}
        </Text>
      </Row>
    ));
  };

  return (
    <Row className="promotion-details" style={styles.detailsContainer} justify="space-between">
      <Col span={22}>
        <Row style={styles.header}>
          <Title className="promotion-name" style={styles.promotionName}>
            {props.boldName ? parse(props.boldName) : props.name}
          </Title>
        </Row>
        <Row>
          <Title style={styles.restaurantName}>{props.restaurantName}</Title>
        </Row>
        <Row>
          <Text className="promotion-description">
            {props.boldDescription ? parse(props.boldDescription) : <p>{props.description}</p>}
          </Text>
        </Row>

        <Row style={styles.scheduleContainer}>
          <Col span={2}>
            <ClockCircleOutlined style={styles.schedule} />
          </Col>
          <Col span={22}>{displaySchedules(props.schedules)}</Col>
        </Row>

        <Row>
          <Text style={styles.footer}>
            Expires<b>{` ${new Date(props.expirationDate).toDateString()}`}</b>
          </Text>
        </Row>

        <Row>
          <Text style={styles.footer}>{promotionAge(props.dateAdded)}</Text>
        </Row>
      </Col>
      <Col span={2} style={styles.rightHand}>
        <Votes
          votes={props.votes}
          voteState={props.voteState}
          onDownvoteClick={props.onDownvoteClick}
          onUpvoteClick={props.onUpvoteClick}
        />
        {likeIcon}
        {props.onDeleteButtonClick && deleteIcon}
      </Col>
    </Row>
  );
}
