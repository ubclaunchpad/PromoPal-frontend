import { Checkbox, Col, Row } from 'antd';
import React, { CSSProperties, ReactElement, useEffect, useState } from 'react';

import UploadPromoButton from '../components/button/UploadPromoButton';
import DropdownMenu from '../components/DropdownMenu';
import PromotionCard from '../components/promotion/PromotionCard';
import UserService from '../services/UserService';
import { Dropdown, DropdownType } from '../types/dropdown';
import { Promotion, User } from '../types/promotion';

const dropdowns: Dropdown[] = [
  {
    text: 'Sort',
    type: DropdownType.Radio,
    options: [
      {
        action: () => {
          /* stub */
        },
        description: 'Sort by Option 1',
        text: 'Option 1',
      },
      {
        action: () => {
          /* stub */
        },
        description: 'Sort by Option 2',
        text: 'Option 2',
      },
      {
        action: () => {
          /* stub */
        },
        description: 'Sort by Option 3',
        text: 'Option 3',
      },
    ],
  },
  {
    text: 'Category',
    type: DropdownType.MultiSelect,
    options: [
      {
        action: () => {
          /* stub */
        },
        text: 'Option 1',
      },
      {
        action: () => {
          /* stub */
        },
        text: 'Option 2',
      },
      {
        action: () => {
          /* stub */
        },
        text: 'Option 3',
      },
    ],
  },
];

const user: User = {
  id: '8f8fc016-5bb2-4906-ad88-68932c438665',
  email: 'example@abc.com',
  firstName: 'John',
  lastName: 'Lee',
  password: '123',
  username: 'user',
};

const dropdownMenuWidth = 30;
const styles: { [identifier: string]: CSSProperties } = {
  body: {
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 20,
    width: '100%',
  },

  dropdownMenuContainer: {
    width: `${dropdownMenuWidth}%`,
  },

  checkBoxContainer: {
    padding: 20,
    width: `${100 - dropdownMenuWidth}%`,
  },

  promotions: {
    marginTop: 15,
  },

  uploadPromoButtonContainer: {
    position: 'fixed',
    bottom: 50,
    right: 50,
  },
};

const onChange = () => {
  /* stub */
};

export default function MyPromotions(): ReactElement {
  const [uploadedPromotions, setUploadedPromotions] = useState<Promotion[]>([]);

  /**
   * On initial render, retrieves the user's uploaded promotions.
   */
  useEffect(() => {
    UserService.getUploadedPromotions(user.id)
      .then((promotions: Promotion[]) => setUploadedPromotions(promotions))
      .catch(() => setUploadedPromotions([]));
  }, []);

  return (
    <>
      <div style={styles.body}>
        <h1>Uploaded by you</h1>
        <div style={{ display: 'inline-flex', width: '100%' }}>
          <div style={styles.dropdownMenuContainer}>
            <DropdownMenu dropdowns={dropdowns} />
          </div>
          <div style={styles.checkBoxContainer}>
            <Checkbox onChange={onChange} style={{ float: 'right' }}>
              Show active deals only
            </Checkbox>
          </div>
        </div>
        <div style={styles.promotions}>
          <Row gutter={16}>
            {uploadedPromotions.map((promotion: Promotion) => (
              <Col span={12}>
                <PromotionCard {...promotion} />
              </Col>
            ))}
          </Row>
        </div>
        <div style={styles.uploadPromoButtonContainer}>
          <UploadPromoButton />
        </div>
      </div>
    </>
  );
}
