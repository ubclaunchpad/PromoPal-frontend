import React, { ReactElement, useState } from 'react';

import AmazonS3Service from '../services/AmazonS3Service';

export default function ImageSelector(): ReactElement {
  const [image, setImage] = useState({ imageBinary: '', imageType: '' });

  return (
    <>
      {/* Displays the image selector if no image is selected */}
      {!image.imageBinary && (
        <input
          type="file"
          accept="image/jpeg, image/png, image/gif"
          onChange={(event) => {
            AmazonS3Service.onFileChange(event)
              .then((image) => setImage(image))
              .catch((err) => alert(err));
          }}
        />
      )}
      {/* Displays the image if an image is selected */}
      {image.imageBinary && <img src={image.imageBinary} alt="" />}
      {/* Displays the remove image button if an image is selected */}
      {image.imageBinary && (
        <button onClick={() => setImage({ imageBinary: '', imageType: '' })}>Remove image</button>
      )}
      {/* Displays the upload image button if an image is selected */}
      {/* TODO: This will need to be removed in the future, as the upload promotion button
          in the upload promotion page will invoke AmazonS3Service.uploadImage(image, promotionId) 
          after an promotion has been successfully saved to our backend db
      */}
      {image.imageBinary && (
        <button onClick={() => AmazonS3Service.uploadImage(image, 'promotionId123')}>
          Upload image
        </button>
      )}
    </>
  );
}
