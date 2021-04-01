import { Skeleton } from 'antd';
import React, { CSSProperties, ReactElement } from 'react';

const styles: { [identifier: string]: CSSProperties } = {
  image: {
    borderRadius: 15,
    minHeight: '100%',
    objectFit: 'cover',
    width: 100,
  },
};

interface Props {
  src?: string;
}

export default function PromotionImage(props: Props): ReactElement {
  // TODO: see https://github.com/ubclaunchpad/PromoPal-backend/issues/101
  const defaultSrc =
    'https://d1ralsognjng37.cloudfront.net/92a7b4fb-892c-47bb-b5bb-884c89c254a2.jpeg';

  const imageSrc = props.src || defaultSrc;
  return (
    <div>{imageSrc ? <img style={styles.image} src={imageSrc} alt="" /> : <Skeleton.Image />}</div>
  );
}
