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
    <>
      {/* Displays the image selector if no image is selected */}
      {!props.image.imageBinary && (
        <input
          type="file"
          accept="image/jpeg, image/png, image/gif"
          onChange={(event) => {
            AmazonS3Service.onFileChange(event)
              .then((image: Image) => {
                props.setImage(image);
              })
              .catch((err: Error) => alert(err));
          }}
        />
      )}
      {/* Displays the image and remove button if an image is selected */}
      {props.image.imageBinary && (
        // TODO: Style the image and remove button
        <>
          <Img height={200} width={200} src={props.image.imageBinary} />
          <Button onClick={() => props.setImage({ imageBinary: '', imageType: '' })}>
            Remove image
          </Button>
        </>
      )}
    </>
  );
}
