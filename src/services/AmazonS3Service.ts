import axios, { AxiosError, AxiosResponse } from 'axios';

interface Image {
  imageBinary: string;
  imageType: string;
}

class AmazonS3Service {
  onFileChange(e: React.ChangeEvent<HTMLInputElement> | DragEvent): Promise<Image> {
    // Get the file from selection or drag and drop
    const files =
      (e as React.ChangeEvent<HTMLInputElement>)?.target?.files ||
      (e as DragEvent)?.dataTransfer?.files ||
      [];
    if (!files.length) return Promise.resolve({ imageBinary: '', imageType: '' });
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
        if (file.length > parseInt(process.env.REACT_APP_AWS_MAX_IMAGE_SIZE as string)) {
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

  uploadImage(image: Image, promotionId: string) {
    // Get the presigned URL
    axios
      .get(process.env.REACT_APP_AWS_PRESIGNED_URL_ENDPOINT as string, {
        params: {
          promotionId: promotionId,
          imageType: image.imageType,
        },
      })
      .then((response: AxiosResponse) => {
        // console.log('Presigned URL response: ', response)
        // Upload the image
        const binary = atob(image.imageBinary.split(',')[1]);
        const array = [];
        for (let i = 0; i < binary.length; i++) {
          array.push(binary.charCodeAt(i));
        }
        const blobData = new Blob([new Uint8Array(array)], {
          type: 'image/' + image.imageType,
        });
        // console.log('Uploading image to: ', response.data.uploadURL)
        const result = fetch(response.data.uploadURL, {
          method: 'PUT',
          body: blobData,
        });
        // console.log('Result: ', result)
        // // Final URL for the user doesn't need the query string params
        // console.log('Upload URL: ', response.data.uploadURL.split('?')[0])
      })
      .catch((err: AxiosError) => {
        return Promise.reject(err);
      });
  }
}

export default new AmazonS3Service();
