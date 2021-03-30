import { AutoComplete } from 'antd';
import React, { ReactElement, useEffect, useState } from 'react';
import usePlacesAutocomplete, { getDetails } from 'use-places-autocomplete';

import LocationService from '../../services/LocationService';

const { Option } = AutoComplete;

interface Props {
  onChange: () => void;
  onSelect: (placeId: string, address: string) => void;
}

export default function LocationSearchInput(props: Props): ReactElement {
  const [location, setLocation] = useState(LocationService.LatLng.defaultLocation);

  const { suggestions, setValue, value } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: {
        country: 'ca',
      },
      location,
      radius: 10 * 1000,
    },
    debounce: 100,
  });

  /**
   * On initial render, fetch user's current location.
   */
  useEffect(() => {
    LocationService.LatLng.getCurrentLocation()
      .then((location) => setLocation(location))
      .catch(() => setLocation(LocationService.LatLng.defaultLocation));
  }, []);

  /**
   * Called when an option is selected from the dropdown.
   *
   * @param value - A stringified JSON object with two keys: `description` and `placeId`
   */
  const handleSelect = (value: string): void => {
    const { description, placeId } = JSON.parse(value);

    // Sets value to be the text displayed on the option selected
    setValue(description, false);

    // Make Places Details request to get address and then calls onSelect handler from parent
    getDetails({ placeId, fields: ['formatted_address'] })
      .then((result) => {
        const address = typeof result === 'string' ? result : result.formatted_address || '';
        props.onSelect(placeId, address);
      })
      .catch(() => props.onSelect(placeId, ''));
  };

  /**
   * Called when the input text has changed.
   *
   * @param value - The input text
   */
  const handleChange = (value: string): void => {
    // Sets value of text input
    setValue(value);

    // Calls onChange handler from parent
    props.onChange();
  };

  return (
    <AutoComplete
      allowClear={true}
      value={value}
      onChange={handleChange}
      onSelect={handleSelect}
      placeholder="e.g. Au Comptoir OR 2278 West 4th Avenue, Vancouver, BC"
    >
      {suggestions.data.map(({ description, place_id: placeId }, index) => (
        <Option key={index} value={JSON.stringify({ description, placeId })}>
          {description}
        </Option>
      ))}
    </AutoComplete>
  );
}
