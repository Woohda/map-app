import { generateVueHelpers } from '@uploadthing/vue';

import type { UploadRouter } from '../server/uploadthing';

export const { useUploadThing, uploadFiles }
  = generateVueHelpers<UploadRouter>();
