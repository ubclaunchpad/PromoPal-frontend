import './Header.css';

import { CloseCircleOutlined } from '@ant-design/icons';
import { Button, Col, Rate, Row, Typography } from 'antd';
import React, { ReactElement } from 'react';

import { DispatchAction, useRestaurantCard } from '../../../contexts/RestaurantCardContext';

const { Text, Title } = Typography;

interface Props {
  // cuisine: string; // todo: this should use a promotions cuisine https://promopal.atlassian.net/browse/PP-91
  distance: number;
  name: string | undefined;
  priceLevel: number | undefined;
  rating: number | undefined;
  website: string | undefined;
}

export default function Header(props: Props): ReactElement {
  const { dispatch } = useRestaurantCard();

  const HeaderTitle = () => (
    <Row>
      <Col span={22}>
        <Title level={3} className="restaurant-name">
          {props.name}
        </Title>
      </Col>
      <Col span={2}>
        <CloseCircleOutlined
          className="close-card"
          onClick={() => dispatch({ type: DispatchAction.HIDE_CARD })}
        />
      </Col>
    </Row>
  );

  const Buttons = () => (
    <Row align="middle" className="action-buttons" justify="space-between">
      <Button className="action-button">
        <a href={props.website}>Website</a>
      </Button>
      <Button className="action-button">
        {/* TODO: update link */}
        <a href="/">Directions</a>
      </Button>
      <Button className="action-button">
        {/* TODO: update link */}
        <a href="/">Call</a>
      </Button>
    </Row>
  );

  return (
    <Col className="restaurant-card-container">
      <HeaderTitle />
      <Row>
        <Rate allowHalf={true} disabled={true} className="rating" defaultValue={props.rating} />
      </Row>
      <Row>
        {/*<Text className="restaurant-details-text">{props.cuisine}</Text>*/}
        <Text className="restaurant-details-text">{props.priceLevel}</Text>
        <Text className="restaurant-details-text">{props.distance}m</Text>
      </Row>
      <Buttons />
    </Col>
  );
}
