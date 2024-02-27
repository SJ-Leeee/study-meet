import { uuid } from 'aws-sdk/clients/customerprofiles';

export type UploadResDto = {
  imageName: uuid;
  imagePath: string;
};
