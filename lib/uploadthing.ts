import type { UploadRouter } from '~server/uploadthing';

import { generateVueHelpers } from '@uploadthing/vue';

export const { useUploadThing, uploadFiles }
  = generateVueHelpers<UploadRouter>();
