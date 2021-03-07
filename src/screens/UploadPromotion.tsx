import './UploadPromotion.less';

import { Col, Row } from 'antd';
import React, { ReactElement } from 'react';

import UploadPromotionForm from '../components/upload-promotion/UploadPromotionForm';

export default function UploadPromotion(): ReactElement {
  const colSpan = { xs: 24, sm: 16, lg: 12 };

  return (
    <div className="upload-promotion-container">
      <Row justify="space-around">
        <Col {...colSpan}>
          <h1 className="header-title">I want to share a deal!</h1>
        </Col>
      </Row>
      <Row justify="space-around">
        <Col {...colSpan}>
          <UploadPromotionForm />
        </Col>
      </Row>
    </div>
  );
}
