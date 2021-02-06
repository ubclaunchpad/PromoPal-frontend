import React, { CSSProperties, ReactElement } from 'react';
import { HeartOutlined } from '@ant-design/icons';
import { Promotion } from '../../types/promotion';
import parse from '../../../node_modules/html-react-parser';

const styles: { [identifier: string]: CSSProperties } = {
  descriptionContainer: {
    padding: 10,
    textAlign: 'left',
    width: '100%',
  },
  header: {
    justifyContent: 'space-between',
  },
  heart: {
    marginTop: 7,
    textAlign: 'right',
  },
};

export default function PromotionDetails({
  name,
  description,
  expirationDate,
  restaurantName = 'Restaurant',
  boldName = undefined,
  boldDescription = undefined,
}: Promotion): ReactElement {
  return (
    <div style={styles.descriptionContainer}>
      <div style={styles.header}>
        {boldName !== undefined ? parse(boldName) : <h2>{name}</h2>}
        <HeartOutlined style={styles.heart} />
      </div>
      <h3>{restaurantName}</h3>
      {boldDescription !== undefined ? parse(boldDescription) : <p>{description}</p>}
      <p>
        Expires on
        <strong>{` ${new Date(expirationDate).toDateString()}`}</strong>
      </p>
    </div>
  );
}
