import React, { ReactElement } from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

export class LocationSearchInput extends React.Component<unknown, { address: string }> {
  constructor(props: unknown) {
    super(props);
    this.state = { address: '' };
  }

  handleChange = (address: string): void => {
    this.setState({ address });
  };

  /* eslint-disable no-console */
  handleSelect = (address: string): void => {
    // todo: we don't need geoCode, this is only for demonstration
    // we only want placeId and the address
    geocodeByAddress(address)
      .then(async (results) => {
        const latLon = await getLatLng(results[0]);
        const placeId = results[0]?.place_id;
        const address = results[0]?.formatted_address;
        console.log(latLon);
        console.log(placeId);
        console.log(address);
      })
      .catch((error) => console.error('Error', error));
  };

  render(): ReactElement {
    return (
      <PlacesAutocomplete
        value={this.state.address}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <script
              async
              defer
              src={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`}
              type="text/javascript"
            />
            <input
              {...getInputProps({
                placeholder: 'Search Places ...',
                className: 'location-search-input',
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map((suggestion) => {
                const className = suggestion.active ? 'suggestion-item--active' : 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer' };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    );
  }
}
