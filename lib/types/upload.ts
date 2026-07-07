export interface UploadedImage {
  url: string;
  key: string;
}

export interface UploadAttachment extends UploadedImage {
  file: File;
  imageId: string;
  isUploading: boolean;
}
