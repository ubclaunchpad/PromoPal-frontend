import './Body.less';

import { OpeningHours, PlacePhoto } from '@googlemaps/google-maps-services-js';
import { Col, Row, Tabs } from 'antd';
import React, { ReactElement } from 'react';

import PhotosTab from './tab/PhotosTab';
import PromotionsTab from './tab/PromotionsTab';

const { TabPane } = Tabs;

function Section({ title, details }: { title: string; details: string }): ReactElement {
  return (
    <Col className="restaurant-section" span={24}>
      <h3>{title}:</h3>
      <p className="restaurant-section-details">{details}</p>
    </Col>
  );
}

interface Props {
  formattedAddress: string | undefined;
  formattedPhoneNumber: string | undefined;
  openingHours: OpeningHours | undefined;
  photos: PlacePhoto[] | undefined;
  restaurantId: string;
}

export default function Body(props: Props): ReactElement {
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
          <PromotionsTab restaurantId={props.restaurantId} />
        </TabPane>
        <TabPane tab="Photos" key="3" className="restaurant-tab-content">
          <PhotosTab photos={props.photos} />
        </TabPane>
      </Tabs>
    </Row>
  );
}
