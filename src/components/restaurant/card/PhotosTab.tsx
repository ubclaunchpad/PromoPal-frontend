import { PlacePhoto } from '@googlemaps/google-maps-services-js';
import { Col, Empty, Image, Row } from 'antd';
import React, { ReactElement } from 'react';

import GooglePlacesService from '../../../services/GooglePlacesService';

interface Props {
  photos?: PlacePhoto[];
}

export default function PhotosTab(props: Props): ReactElement {
  /**
   * Constructs the caption for the photo.
   *
   * @param htmlAttributions - The html attributions of the photo, as given by the Google Places API
   */
  function getCaption(htmlAttributions: string[]): ReactElement {
    let caption = <>No caption</>;

    if (htmlAttributions.length > 0) {
      // Uses the first attribution
      const attribution = htmlAttributions[0];

      const doc = new DOMParser().parseFromString(attribution, 'text/html');
      const element = doc.body.children?.[0];

      const url = element?.getAttribute('href') || '';
      const title = element?.textContent || '';

      if (url && title) {
        caption = (
          <a target="_blank" rel="noopener noreferrer" href={url}>
            {title}
          </a>
        );
      }
    }

    return <div className="photo-caption">{caption}</div>;
  }

  if (props.photos && props.photos?.length > 0) {
    return (
      <Row className="photos-tab" gutter={6} justify="space-between">
        {props.photos.map((photo) => (
          <Col className="photo-container" span={12}>
            <Image
              width={150}
              height={150}
              src={GooglePlacesService.getRestaurantPhotoUrl(photo)}
            />
            {getCaption(photo.html_attributions)}
          </Col>
        ))}
      </Row>
    );
  }

  return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
}
