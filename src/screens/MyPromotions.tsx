import '../index.less';

import { Checkbox, Col, Row } from 'antd';
import React, { CSSProperties, ReactElement, useCallback, useEffect, useState } from 'react';

import UploadPromoButton from '../components/button/UploadPromoButton';
import DropdownMenu from '../components/DropdownMenu';
import DeleteModal from '../components/my-promotions/DeleteModal';
import PromotionCard from '../components/promotion/PromotionCard';
import { useFirebase } from '../contexts/FirebaseContext';
import PromotionService from '../services/PromotionService';
import UserService from '../services/UserService';
import { Dropdown, DropdownType } from '../types/dropdown';
import { Promotion, VoteState } from '../types/promotion';

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
  const firebase = useFirebase();
  /**
   * Fetches the user's uploaded promotions and sets them on this component.
   */
  const getUploadedPromotions = async (): Promise<void> => {
    return UserService.getUploadedPromotions(firebase)
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
          return UserService.unsavePromotion(promotionId, firebase)
            .then(() => setUploadedPromotions(promotions))
            .catch(() => null);
        }
        promotion.isSavedByUser = true;
        return UserService.savePromotion(promotionId, firebase)
          .then(() => setUploadedPromotions(promotions))
          .catch(() => null);
      }
    },
    [firebase, uploadedPromotions, setUploadedPromotions]
  );

  /**
   * If the user has not downvoted the promotion, downvote the promotion. Otherwise, set back to initial state.
   *
   * @param promotionId - The id of the promotion to downvote
   */
  const onDownvoteClick = useCallback(
    (promotionId: string): void => {
      const promos = [...uploadedPromotions];
      const promotion = promos.find(({ id }) => id === promotionId);
      if (promotion) {
        if (promotion.voteState === VoteState.DOWN) {
          promotion.votes = promotion.votes + 1;
          promotion.voteState = VoteState.INIT;
          PromotionService.downvotePromotion(promotionId)
            .then(() => setUploadedPromotions(promos))
            .catch(() => null);
        } else {
          if (promotion.voteState === VoteState.UP) {
            // Remove upvote
            promotion.votes = promotion.votes - 1;
          }
          promotion.votes = promotion.votes - 1;
          promotion.voteState = VoteState.DOWN;
          PromotionService.downvotePromotion(promotionId)
            .then(() => setUploadedPromotions(promos))
            .catch(() => null);
        }
      }
    },
    [uploadedPromotions, setUploadedPromotions]
  );

  /**
   * If the user has not upvoted the promotion, upvote the promotion. Otherwise, set back to initial state.
   *
   * @param promotionId - The id of the promotion to upvote
   */
  const onUpvoteClick = useCallback(
    (promotionId: string): void => {
      const promos = [...uploadedPromotions];
      const promotion = promos.find(({ id }) => id === promotionId);
      if (promotion) {
        if (promotion.voteState === VoteState.UP) {
          promotion.votes = promotion.votes - 1;
          promotion.voteState = promotion.voteState = VoteState.INIT;
          PromotionService.upvotePromotion(promotionId)
            .then(() => setUploadedPromotions(promos))
            .catch(() => null);
        } else {
          if (promotion.voteState === VoteState.DOWN) {
            // Remove downvote
            promotion.votes = promotion.votes + 1;
          }
          promotion.votes = promotion.votes + 1;
          promotion.voteState = promotion.voteState = VoteState.UP;
          PromotionService.upvotePromotion(promotionId)
            .then(() => setUploadedPromotions(promos))
            .catch(() => null);
        }
      }
    },
    [uploadedPromotions, setUploadedPromotions]
  );

  /**
   * On initial render, retrieves the user's uploaded promotions.
   */
  useEffect(() => {
    UserService.getUploadedPromotions(firebase)
      .then((promotions: Promotion[]) => setUploadedPromotions(promotions))
      .catch(() => setUploadedPromotions([]));
  }, [firebase]);

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
              isSavedByUser={promotion.isSavedByUser}
              name={promotion.name}
              placeId={promotion.restaurant.id}
              // TODO: https://promopal.atlassian.net/browse/PP-96
              restaurantName=""
              schedules={promotion.schedules}
              votes={promotion.votes}
              voteState={promotion.voteState}
              onDeleteButtonClick={() => onDeleteButtonClick(promotion)}
              onDownvoteClick={() => onDownvoteClick(promotion.id)}
              onSaveButtonClick={() => onSaveButtonClick(promotion.id)}
              onUpvoteClick={() => onUpvoteClick(promotion.id)}
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
