import { Card } from 'antd';
import React, { CSSProperties, ReactElement } from 'react';

import { Promotion } from '../../types/promotion';
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

export default function PromotionCard({
  promotion,
  onClick,
}: {
  promotion: Promotion;
  onClick: () => void;
}): ReactElement {
  return (
    <Card style={styles.card} bodyStyle={styles.body} onClick={onClick}>
      <PromotionImage {...promotion.image} />
      <PromotionDetails {...promotion} />
    </Card>
  );
}
