import './Header.less';

import { Button, Rate, Row } from 'antd';
import React, { ReactElement } from 'react';

interface Props {
  distance: number;
  name: string | undefined;
  priceLevel: number | undefined;
  rating: number | undefined;
  website: string | undefined;
}

export default function Header(props: Props): ReactElement {
  /**
   * Returns the distance of the restaurant from the user, rounded to the nearest .1 of a kilometre
   *
   * @param distance - The distance of the restaurant from the user's current location, in metres
   */
  const formatDistance = (distance: number): number => {
    if (distance > 0) {
      const km = distance / 1000;
      return Math.round(km * 10) / 10;
    }
    return 0;
  };

  /**
   * Returns a string that displays the priceLevel in number of dollar signs.
   *
   * @param priceLevel - The price level of the restaurant
   */
  const formatPriceLevel = (priceLevel: number | undefined): string => {
    if (priceLevel === undefined) {
      return '$';
    }
    let formattedPriceLevel = '';
    for (let i = 0; i < priceLevel; i++) {
      formattedPriceLevel += '$';
    }
    return formattedPriceLevel;
  };

  /**
   * Returns the restaurant rating rounded to the nearest half-star.
   *
   * @param rating - The restaurant rating
   */
  const normalizeRating = (rating: number | undefined): number => {
    if (rating === undefined) {
      return 0;
    }
    return Math.round(rating * 2) / 2;
  };

  const separator = <p className="restaurant-details-text">&#8226;</p>;

  return (
    <Row className="restaurant-card-header-component restaurant-details">
      <div>
        <Rate
          allowHalf={true}
          disabled={true}
          className="rating"
          defaultValue={normalizeRating(props.rating)}
        />
        <div>
          <p className="restaurant-details-text">{formatPriceLevel(props.priceLevel)}</p>
          {separator}
          <p className="restaurant-details-text">{formatDistance(props.distance)}km</p>
        </div>
      </div>
      <Button className="action-button">
        <a href={props.website} target="_blank" rel="noopener noreferrer">
          Website
        </a>
      </Button>
    </Row>
  );
}
