import './Body.css';

import { Place } from '@googlemaps/google-maps-services-js';
import { Col, Row, Tabs, Typography } from 'antd';
import React, { ReactElement } from 'react';

import { usePromotionsList } from '../../../contexts/PromotionsListContext';
import PhotosTab from './PhotosTab';
import PromotionsTab from './tab/PromotionsTab';

const { TabPane } = Tabs;
const { Text } = Typography;

function Section({ title, details }: { title: string; details: string }): ReactElement {
  return (
    <Col className="restaurant-section" span={24}>
      <Row>
        <Text strong>{title}:</Text>
      </Row>
      <Row className="restaurant-section-details">{details}</Row>
    </Col>
  );
}

export default function Body({
  formatted_address,
  opening_hours,
  formatted_phone_number,
  photos,
}: Pick<
  Place,
  'formatted_address' | 'opening_hours' | 'formatted_phone_number' | 'photos'
>): ReactElement {
  // TODO: https://promopal.atlassian.net/browse/PP-81
  const { state } = usePromotionsList();

  return (
    <Row>
      <Tabs className="restaurant-tabs" defaultActiveKey="1" size="small">
        <TabPane tab="Info" key="1" className="restaurant-tab-content">
          <Section title="Address" details={formatted_address ?? 'No address found'} />
          <Section
            title="Hours"
            details={opening_hours?.weekday_text.join('\r\n') ?? 'No available hours found'}
          />
          <Section title="Phone" details={formatted_phone_number ?? 'No phone number found'} />
        </TabPane>
        <TabPane tab="Promotions" key="2" className="restaurant-tab-content">
          <PromotionsTab promotions={state.data} />
        </TabPane>
        <TabPane tab="Photos" key="3" className="restaurant-tab-content">
          <PhotosTab photos={photos} />
        </TabPane>
      </Tabs>
    </Row>
  );
}
