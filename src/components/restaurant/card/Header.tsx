import './Header.css';

import { Button, Rate, Row } from 'antd';
import React, { ReactElement } from 'react';

interface Props {
  // cuisine: string; // todo: this should use a promotions cuisine https://promopal.atlassian.net/browse/PP-91
  distance: number;
  name: string | undefined;
  priceLevel: number | undefined;
  rating: number | undefined;
  website: string | undefined;
}

export default function Header(props: Props): ReactElement {
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

  const Buttons = (): ReactElement => (
    <Row className="action-buttons restaurant-card-header-component">
      <Button className="action-button">
        <a href={props.website} target="_blank" rel="noopener noreferrer">
          Website
        </a>
      </Button>
      {/* <Button className="action-button">
        <a href="/">Directions</a>
      </Button>
      <Button className="action-button">
        <a href="/">Call</a>
      </Button> */}
    </Row>
  );

  return (
    <>
      <Row className="restaurant-card-header-component">
        <Rate
          allowHalf={true}
          disabled={true}
          className="rating"
          defaultValue={normalizeRating(props.rating)}
        />
      </Row>
      <Row className="restaurant-card-header-component">
        {/*<p className="restaurant-details-text">{props.cuisine}</p>*/}
        <p className="restaurant-details-text">{formatPriceLevel(props.priceLevel)}</p>
        {separator}
        <p className="restaurant-details-text">{props.distance}m</p>
      </Row>
      <Buttons />
    </>
  );
}
