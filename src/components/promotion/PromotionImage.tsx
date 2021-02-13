import { Skeleton } from 'antd';
import React, { CSSProperties, ReactElement } from 'react';

import { PromotionImage as PromotionImageProps } from '../../types/promotion';

const styles: { [identifier: string]: CSSProperties } = {
  image: {
    borderRadius: 15,
    minHeight: '100%',
    objectFit: 'cover',
    width: 100,
  },
};

export default function PromotionImage({
  // TODO: see https://github.com/ubclaunchpad/PromoPal-backend/issues/101
  src = 'https://d1ralsognjng37.cloudfront.net/92a7b4fb-892c-47bb-b5bb-884c89c254a2.jpeg',
}: PromotionImageProps): ReactElement {
  return (
    <div>{src?.length ? <img style={styles.image} src={src} alt="" /> : <Skeleton.Image />}</div>
  );
}
