import axios, { AxiosError, AxiosResponse } from 'axios';

import { Image } from '../types/image';

const maxImageBinaryLength = 1000000;

class AmazonS3Service {
  onFileChange(e: React.ChangeEvent<HTMLInputElement> | DragEvent): Promise<Image> {
    // Get the file from selection or drag and drop
    const files =
      (e as React.ChangeEvent<HTMLInputElement>)?.target?.files ||
      (e as DragEvent)?.dataTransfer?.files ||
      [];
    if (!files.length) {
      return Promise.resolve({ imageBinary: '', imageType: '' });
    }
    const file = files[0];
    // Convert file into binary string
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = (e: ProgressEvent<FileReader>) => {
        // Only allow jpg, jpeg, png, and gifs to be selected
        const file = e?.target?.result as string;
        const fileRegexMatches = file.match(/image\/(jpe?g|png|gif)/);
        if (fileRegexMatches === null) {
          return reject(new Error('Wrong file type. Only images are allowed.'));
        }
        // Restrict the size of the file
        if (file.length > maxImageBinaryLength) {
          return reject(new Error('Image is loo large.'));
        }
        return resolve({
          imageBinary: file,
          imageType: fileRegexMatches[1],
        });
      };
      reader.readAsDataURL(file);
    });
  }

  uploadImage(image: Image, promotionId: string): void {
    // Get the presigned URL
    axios
      .get(process.env.REACT_APP_AWS_PRESIGNED_URL_ENDPOINT as string, {
        params: {
          promotionId,
          imageType: image.imageType,
        },
      })
      .then((response: AxiosResponse) => {
        // Upload the image
        const binary = atob(image.imageBinary.split(',')[1]);
        const array = [];
        for (let i = 0; i < binary.length; i++) {
          array.push(binary.charCodeAt(i));
        }
        const blobData = new Blob([new Uint8Array(array)], {
          type: 'image/' + image.imageType,
        });
        fetch(response.data.uploadURL, {
          method: 'PUT',
          body: blobData,
        });
        // Uploaded photo URL will be https://promopal.s3-us-west-1.amazonaws.com/`promotionId`
      })
      .catch((err: AxiosError) => {
        return Promise.reject(err);
      });
  }

  getImageUrl(promotionId: string): string {
    return `https://promopal.s3-us-west-1.amazonaws.com/${promotionId}`
  }
}

export default new AmazonS3Service();
