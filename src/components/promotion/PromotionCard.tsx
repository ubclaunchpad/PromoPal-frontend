import './PromotionCard.less';

import { Card } from 'antd';
import React, { CSSProperties, ReactElement } from 'react';

import { PromotionImage as PromotionImageType, Schedule, VoteState } from '../../types/promotion';
import PromotionDetails from '../promotion/PromotionDetails';
import PromotionImage from '../promotion/PromotionImage';

const styles: { [identifier: string]: CSSProperties } = {
  body: {
    display: 'inline-flex',
    padding: 10,
    textAlign: 'left',
    width: '100%',
  },
};

interface Props {
  dateAdded: string;
  description: string;
  expirationDate: string;
  id: string;
  image: PromotionImageType;
  isSavedByUser: boolean;
  name: string;
  placeId: string;
  restaurantName: string;
  schedules: Schedule[];
  votes: number;
  voteState: VoteState;

  onDownvoteClick: () => void;
  onSaveButtonClick: () => void;
  onUpvoteClick: () => void;

  boldName?: string;
  boldDescription?: string;

  onCardClick?: () => void;
  onDeleteButtonClick?: () => void;
}

export default function PromotionCard(props: Props): ReactElement {
  return (
    <Card className="restaurant-card" bodyStyle={styles.body} onClick={props.onCardClick}>
      <PromotionImage src={props.image?.src} />
      <PromotionDetails
        boldName={props.boldName}
        boldDescription={props.boldDescription}
        dateAdded={props.dateAdded}
        description={props.description}
        expirationDate={props.expirationDate}
        id={props.id}
        name={props.name}
        restaurantName={props.restaurantName}
        isSavedByUser={props.isSavedByUser}
        schedules={props.schedules}
        votes={props.votes}
        voteState={props.voteState}
        onDeleteButtonClick={props.onDeleteButtonClick}
        onSaveButtonClick={props.onSaveButtonClick}
        onDownvoteClick={props.onDownvoteClick}
        onUpvoteClick={props.onUpvoteClick}
      />
    </Card>
  );
}
