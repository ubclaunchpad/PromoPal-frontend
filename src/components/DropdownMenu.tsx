import './DropdownMenu.less';

import { Col, Row, Typography } from 'antd';
import React, { ReactElement, useCallback } from 'react';

import { useDropdown } from '../contexts/DropdownContext';
import { DispatchAction, usePromotionsList } from '../contexts/PromotionsListContext';
import { Dropdown as DropdownType } from '../types/dropdown';
import { className } from '../utils/component';
import Dropdown from './dropdown/Dropdown';

const { Text } = Typography;

function ClearAllButton(): ReactElement {
  const promotionsList = usePromotionsList();
  const dropdown = useDropdown();

  /**
   * Sets promotion list filter and sort to default and clears dropdowns
   */
  const handleClearAll = useCallback(() => {
    promotionsList.dispatch({ type: DispatchAction.RESET_FILTERS });
    dropdown.state.resetCallbacks.forEach((resetDropdown) => resetDropdown());
  }, [dropdown, promotionsList]);

  return (
    <Col className="clear-all" onClick={handleClearAll}>
      <Text>Clear All</Text>
    </Col>
  );
}

/**
 * @component DropdownMenu
 * This component acts as a container displaying the list of provided dropdowns.
 *
 * @param dropdowns The list of Dropdown objects for this menu with the title of the dropdown button,
 * the dropdown type (radio or multiple select), and the list of options to be selected
 * @param shadow Whether or not to display the surrounding box shadow
 */
export default function DropdownMenu({
  dropdowns,
  shadow = false,
}: {
  dropdowns: DropdownType[];
  shadow?: boolean;
}): ReactElement {
  return (
    <Row
      id="dropdown-menu"
      className={className(
        { 'dropdown-menu-container--shadow': !!shadow },
        'dropdown-menu-container'
      )}
    >
      {dropdowns.map((dropdown, index) => (
        <Col key={index}>
          <Dropdown {...dropdown} />
        </Col>
      ))}
      <ClearAllButton />
    </Row>
  );
}
