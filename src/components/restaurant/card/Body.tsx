import './Body.css';

import { OpeningHours, PlacePhoto } from '@googlemaps/google-maps-services-js';
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

interface Props {
  formattedAddress: string | undefined;
  formattedPhoneNumber: string | undefined;
  openingHours: OpeningHours | undefined;
  photos: PlacePhoto[] | undefined;
}

export default function Body(props: Props): ReactElement {
  // TODO: https://promopal.atlassian.net/browse/PP-81
  const { state } = usePromotionsList();

  return (
    <Row>
      <Tabs className="restaurant-tabs" defaultActiveKey="1" size="small">
        <TabPane tab="Info" key="1" className="restaurant-tab-content">
          <Section title="Address" details={props.formattedAddress ?? 'No address found'} />
          <Section
            title="Hours"
            details={props.openingHours?.weekday_text.join('\r\n') ?? 'No available hours found'}
          />
          <Section title="Phone" details={props.formattedPhoneNumber ?? 'No phone number found'} />
        </TabPane>
        <TabPane tab="Promotions" key="2" className="restaurant-tab-content">
          <PromotionsTab promotions={state.data} />
        </TabPane>
        <TabPane tab="Photos" key="3" className="restaurant-tab-content">
          <PhotosTab photos={props.photos} />
        </TabPane>
      </Tabs>
    </Row>
  );
}
