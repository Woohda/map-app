export interface UploadedImage {
  url: string;
  uploadthingKey: string;
}

export interface UploadAttachment extends UploadedImage {
  file: File;
  imageId: string;
  isUploading: boolean;
}
