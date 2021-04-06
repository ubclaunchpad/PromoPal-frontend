import './Votes.less';

import {
  DownCircleFilled,
  DownCircleOutlined,
  UpCircleFilled,
  UpCircleOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import React, { ReactElement } from 'react';

interface Props {
  userDownvoted: boolean;
  userUpvoted: boolean;
  numberOfVotes: number;

  onDownvoteClick: () => void;
  onUpvoteClick: () => void;
}

export default function Votes(props: Props): ReactElement {
  return (
    <div className="votes-container">
      <Button
        type="link"
        icon={
          props.userUpvoted ? (
            <UpCircleFilled className="upvote-icon upvote-icon-filled" />
          ) : (
            <UpCircleOutlined className="upvote-icon" />
          )
        }
        onClick={props.onUpvoteClick}
      />
      <p className="number-of-votes">{props.numberOfVotes}</p>
      <Button
        type="link"
        icon={
          props.userDownvoted ? (
            <DownCircleFilled className="downvote-icon downvote-icon-filled" />
          ) : (
            <DownCircleOutlined className="downvote-icon" />
          )
        }
        onClick={props.onUpvoteClick}
      />
    </div>
  );
}
