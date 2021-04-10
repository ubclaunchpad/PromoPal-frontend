import './ImageSelector.less';

import { Button, Image as Img } from 'antd';
import React, { ReactElement } from 'react';

import AmazonS3Service from '../services/AmazonS3Service';
import { Image } from '../types/image';

interface Props {
  image: Image;
  setImage: (image: Image) => void;
}

export default function ImageSelector(props: Props): ReactElement {
  return (
    <div className="promotion-image-upload">
      {/* Displays the image selector if no image is selected */}
      {!props.image.imageBinary && (
        <input
          type="file"
          accept="image/jpeg, image/png, image/gif"
          className="upload-image-button"
          onChange={(event) => {
            AmazonS3Service.onFileChange(event)
              .then((image: Image) => props.setImage(image))
              .catch((err: Error) => alert(err));
          }}
        />
      )}
      {/* Displays the image and remove button if an image is selected */}
      {props.image.imageBinary && (
        <>
          <div className="remove-image-button-container">
            <Button
              className="remove-image-button"
              onClick={() => props.setImage({ imageBinary: '', imageType: '' })}
            >
              Remove
            </Button>
          </div>
          <div>
            <Img
              className="image-selector-img"
              height={200}
              width={200}
              src={props.image.imageBinary}
            />
          </div>
        </>
      )}
    </div>
  );
}
