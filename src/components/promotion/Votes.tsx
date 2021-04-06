import './Votes.less';

import {
  DownCircleFilled,
  DownCircleOutlined,
  UpCircleFilled,
  UpCircleOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import React, { MouseEvent, ReactElement } from 'react';

import { VoteState } from '../../types/promotion';

interface Props {
  votes: number;
  voteState: VoteState;

  onDownvoteClick: () => void;
  onUpvoteClick: () => void;
}

export default function Votes(props: Props): ReactElement {
  /**
   * Stops restaurant card from being opened when the downvote button is pressed.
   *
   * @param event - The event received from the button click
   */
  const onDownvoteHandler = (event: MouseEvent<HTMLElement>): void => {
    event.stopPropagation();
    props.onDownvoteClick();
  };

  /**
   * Stops restaurant card from being opened when the upvote button is pressed.
   *
   * @param event - The event received from the button click
   */
  const onUpvoteHandler = (event: MouseEvent<HTMLElement>): void => {
    event.stopPropagation();
    props.onUpvoteClick();
  };

  return (
    <div className="votes-container">
      <Button
        type="link"
        icon={
          props.voteState === VoteState.UP ? (
            <UpCircleFilled className="upvote-icon upvote-icon-filled" />
          ) : (
            <UpCircleOutlined className="upvote-icon" />
          )
        }
        onClick={onUpvoteHandler}
      />
      <p className="number-of-votes">{props.votes}</p>
      <Button
        type="link"
        icon={
          props.voteState === VoteState.DOWN ? (
            <DownCircleFilled className="downvote-icon downvote-icon-filled" />
          ) : (
            <DownCircleOutlined className="downvote-icon" />
          )
        }
        onClick={onDownvoteHandler}
      />
    </div>
  );
}
