import './PromotionImage.less';

import { Skeleton } from 'antd';
import React, { ReactElement, useState } from 'react';

interface Props {
  src: string;
}

// TODO: see https://github.com/ubclaunchpad/PromoPal-backend/issues/101
const defaultSrc =
  'https://d1ralsognjng37.cloudfront.net/92a7b4fb-892c-47bb-b5bb-884c89c254a2.jpeg';

export default function PromotionImage(props: Props): ReactElement {
  const [error, setError] = useState<boolean>(false);
  const [imageSrc, setImageSrc] = useState<string>(props.src);

  /**
   * Handler for errors when fetching promotion image.
   */
  const onErrorHandler = (): void => {
    if (!error) {
      setError(true);
      setImageSrc(defaultSrc);
    }
  };

  return (
    <div>
      {imageSrc ? (
        <img className="promotion-image" src={imageSrc} onError={onErrorHandler} alt="" />
      ) : (
        <Skeleton.Image />
      )}
    </div>
  );
}
