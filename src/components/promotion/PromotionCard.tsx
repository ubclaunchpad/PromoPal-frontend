import { Card } from 'antd';
import React, { CSSProperties, ReactElement } from 'react';

import { PromotionImage as PromotionImageType, Schedule } from '../../types/promotion';
import PromotionDetails from '../promotion/PromotionDetails';
import PromotionImage from '../promotion/PromotionImage';

const styles: { [identifier: string]: CSSProperties } = {
  body: {
    display: 'inline-flex',
    padding: 10,
    textAlign: 'left',
    width: '100%',
  },
  card: {
    borderRadius: 15,
    borderWidth: 0,
    boxShadow: '2px 2px 4px 0px #40333333',
    cursor: 'pointer',
    display: 'inline-block',
    marginBottom: 15,
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

  onSaveButtonClick: () => void;

  boldName?: string;
  boldDescription?: string;

  onCardClick?: () => void;
  onDeleteButtonClick?: () => void;
}

export default function PromotionCard(props: Props): ReactElement {
  return (
    <Card style={styles.card} bodyStyle={styles.body} onClick={props.onCardClick}>
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
        onDeleteButtonClick={props.onDeleteButtonClick}
        onSaveButtonClick={props.onSaveButtonClick}
      />
    </Card>
  );
}
