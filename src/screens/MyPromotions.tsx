import '../index.css';

import { Checkbox, Col, Row } from 'antd';
import React, { CSSProperties, ReactElement, useCallback, useEffect, useState } from 'react';

import UploadPromoButton from '../components/button/UploadPromoButton';
import DropdownMenu from '../components/DropdownMenu';
import DeleteModal from '../components/my-promotions/DeleteModal';
import PromotionCard from '../components/promotion/PromotionCard';
import * as PromotionService from '../services/PromotionService';
import UserService from '../services/UserService';
import { Dropdown, DropdownType } from '../types/dropdown';
import { Promotion } from '../types/promotion';

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

const onChange = (): void => {
  /* stub */
};

export default function MyPromotions(): ReactElement {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [promotionToDelete, setPromotionToDelete] = useState<Promotion | null>(null);
  const [uploadedPromotions, setUploadedPromotions] = useState<Promotion[]>([]);

  /**
   * Fetches the user's uploaded promotions and sets them on this component.
   */
  const getUploadedPromotions = async (): Promise<void> => {
    return UserService.getUploadedPromotions()
      .then((promotions: Promotion[]) => setUploadedPromotions(promotions))
      .catch(() => setUploadedPromotions([]));
  };

  /**
   * When a user confirms the deletion, update the list of uploaded promotions.
   */
  const onDeleteOk = async (): Promise<void> => {
    if (promotionToDelete) {
      return PromotionService.deletePromotion(promotionToDelete.id)
        .then(() => getUploadedPromotions())
        .then(() => setIsModalVisible(false))
        .catch((err: Error) => Promise.reject(err));
    }
  };

  /**
   * When a user cancels the deletion, close the modal.
   */
  const onDeleteCancel = (): void => {
    setIsModalVisible(false);
  };

  /**
   * When a user clicks the delete button, open the modal and set the promotion to delete.
   */
  const onDeleteButtonClick = useCallback((promotion: Promotion): void => {
    setIsModalVisible(true);
    setPromotionToDelete(promotion);
  }, []);

  /**
   * If the user has not saved the promotion, save the promotion. Otherwise, delete it from their saved promotions.
   */
  const onSaveButtonClick = useCallback(
    (promotionId: string) => {
      const promotions = [...uploadedPromotions];
      const promotion = promotions.find(({ id }) => id === promotionId);
      if (promotion) {
        if (promotion.isSavedByUser) {
          promotion.isSavedByUser = false;
          return UserService.unsavePromotion(promotionId)
            .then(() => setUploadedPromotions(promotions))
            .catch(() => null);
        }
        promotion.isSavedByUser = true;
        return UserService.savePromotion(promotionId)
          .then(() => setUploadedPromotions(promotions))
          .catch(() => null);
      }
    },
    [uploadedPromotions, setUploadedPromotions]
  );

  /**
   * On initial render, retrieves the user's uploaded promotions.
   */
  useEffect(() => {
    getUploadedPromotions();
  }, []);

  const renderUploadedPromotions = (): ReactElement => {
    return (
      <Row gutter={16}>
        {uploadedPromotions.map((promotion: Promotion, index: number) => (
          <Col span={12} key={index}>
            <PromotionCard
              id={promotion.id}
              boldDescription={promotion.boldDescription}
              boldName={promotion.boldName}
              dateAdded={promotion.dateAdded}
              expirationDate={promotion.expirationDate}
              description={promotion.description}
              image={promotion.image}
              name={promotion.name}
              placeId={promotion.placeId}
              restaurantName={promotion.restaurantName}
              savedByUser={promotion.isSavedByUser}
              schedules={promotion.schedules}
              onDeleteButtonClick={() => onDeleteButtonClick(promotion)}
              onSaveButtonClick={() => onSaveButtonClick(promotion.id)}
            />
          </Col>
        ))}
      </Row>
    );
  };

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
        <div style={styles.promotions}>{renderUploadedPromotions()}</div>
        <div style={styles.uploadPromoButtonContainer}>
          <UploadPromoButton />
        </div>
      </div>

      {promotionToDelete && (
        <DeleteModal
          title="Delete Promotion"
          description={
            <>
              Are you sure you want to delete the promotion <b>{promotionToDelete.name}</b>?
            </>
          }
          isVisible={isModalVisible}
          promotion={promotionToDelete}
          onOk={onDeleteOk}
          onCancel={onDeleteCancel}
        />
      )}
    </>
  );
}