import './Body.css';

import { Place } from '@googlemaps/google-maps-services-js';
import { Col, Row, Tabs, Typography } from 'antd';
import React, { ReactElement } from 'react';

import PhotosTab from './PhotosTab';

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
  function formatPhoneNumber(phoneNumber: string): string {
    const segments = phoneNumber.split('-');
    if (segments.length > 1) {
      const areaCode = segments[0];
      const kebab = segments.slice(1).join('-');
      return `(${areaCode}) ${kebab}`;
    }
    return phoneNumber;
  }

  return (
    <Row>
      <Tabs className="restaurant-tabs" defaultActiveKey="1" size="small">
        <TabPane tab="Info" key="1" className="restaurant-tab-content">
          <Section title="Address" details={formatted_address ?? 'No address found'} />
          <Section
            title="Hours"
            details={opening_hours?.weekday_text.join('\r\n') ?? 'No available hours found'}
          />
          <Section
            title="Phone"
            details={formatPhoneNumber(formatted_phone_number ?? 'No phone number found')}
          />
        </TabPane>
        <TabPane tab="Promotions" key="2" className="restaurant-tab-content">
          Promotions
        </TabPane>
        <TabPane tab="Photos" key="3" className="restaurant-tab-content">
          <PhotosTab photos={photos} />
        </TabPane>
      </Tabs>
    </Row>
  );
}
