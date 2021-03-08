import './Body.css';

import { Col, Row, Tabs, Typography } from 'antd';
import React, { CSSProperties, ReactElement } from 'react';

import { usePromotionsList } from '../../../contexts/PromotionsListContext';
import { Restaurant } from '../../../types/restaurant';
import PromotionsTab from './tab/PromotionsTab';

const { TabPane } = Tabs;
const { Text } = Typography;

const styles: { [identifier: string]: CSSProperties } = {
  section: {
    paddingBottom: 10,
  },
  sectionDetails: {
    whiteSpace: 'pre-line',
  },
  tabContent: {
    flex: 'inherit',
    margin: '10px 20px',
    wordBreak: 'break-word',
  },
  tabs: {
    width: '100%',
  },
};

function Section({ title, details }: { title: string; details: string }): ReactElement {
  return (
    <Col span={24} style={styles.section}>
      <Row>
        <Text strong>{title}:</Text>
      </Row>
      <Row style={styles.sectionDetails}>{details}</Row>
    </Col>
  );
}

export default function Body({
  address,
  openingHours,
  phoneNumber,
}: Pick<Restaurant, 'address' | 'openingHours' | 'phoneNumber'>): ReactElement {
  // TODO: https://promopal.atlassian.net/browse/PP-81
  const { state } = usePromotionsList();

  function formatHours(hours: Restaurant['openingHours']): string {
    return `Sun: ${hours.sunday}
      Mon: ${hours.monday}
      Tue: ${hours.tuesday}
      Wed: ${hours.wednesday}
      Thu: ${hours.thursday}
      Fri: ${hours.friday}
      Sat: ${hours.saturday}
    `;
  }

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
    <Row className="restaurant-card-body">
      <Tabs style={styles.tabs} defaultActiveKey="1" size="small">
        <TabPane tab="Info" key="1" style={styles.tabContent}>
          <Section title="Address" details={address} />
          <Section title="Hours" details={formatHours(openingHours)} />
          <Section title="Phone" details={formatPhoneNumber(phoneNumber)} />
        </TabPane>
        <TabPane tab="Promotions" key="2" style={styles.tabContent}>
          <PromotionsTab promotions={state.data} />
        </TabPane>
        <TabPane tab="Photos" key="3" style={styles.tabContent}>
          Photos
        </TabPane>
      </Tabs>
    </Row>
  );
}
