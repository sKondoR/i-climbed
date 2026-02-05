declare module 'microfrontend/EditImage' {
  import { FC } from 'react';
  
  export const EditImage: FC<{
    imgSrc: string;
    name: string;
    region: string;
    grade: string;
  }>;

  export default EditImage;
}

