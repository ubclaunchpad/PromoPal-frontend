import { Button, Image as Img } from 'antd';
import React, { ReactElement, useState } from 'react';

import AmazonS3Service from '../services/AmazonS3Service';
import { Image } from '../types/image';

interface Props {
  onChange: (imageBinary: string, imageType: string) => void;
}

export default function ImageSelector(props: Props): ReactElement {
  const [image, setImage] = useState<Image>({ imageBinary: '', imageType: '' });

  return (
    <>
      {/* Displays the image selector if no image is selected */}
      {!image.imageBinary && (
        <input
          type="file"
          accept="image/jpeg, image/png, image/gif"
          onChange={(event) => {
            AmazonS3Service.onFileChange(event)
              .then((image: Image) => {
                setImage(image);
                props.onChange(image.imageBinary, image.imageType);
              })
              .catch((err: Error) => alert(err));
          }}
        />
      )}
      {/* Displays the image if an image is selected */}
      {image.imageBinary && (
        // TODO: Style the image and remove button
        <>
          <Img height={200} width={200} src={image.imageBinary} />
          <Button onClick={() => setImage({ imageBinary: '', imageType: '' })}>Remove image</Button>
        </>
      )}
      {/* Displays the upload image button if an image is selected */}
      {/* TODO: https://promopal.atlassian.net/browse/PP-75
          This will need to be removed in the future, as the upload promotion button
          in the upload promotion page will invoke AmazonS3Service.uploadImage(image, promotionId) 
          after an promotion has been successfully saved to our backend db
      */}
      {image.imageBinary && (
        <button onClick={() => AmazonS3Service.uploadImage(image, 'testpromoid')}>
          Upload image
        </button>
      )}
    </>
  );
}
