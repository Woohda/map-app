import type { FileRouter } from 'uploadthing/h3';

import { createUploadthing } from 'uploadthing/h3';
import { UploadThingError } from 'uploadthing/server';

import { validateRequest } from './utils/auth';

const f = createUploadthing();

export const uploadRouter = {
  attachments: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 5,
    },
  })
    .middleware(async ({ event }) => {
      const { user } = await validateRequest(event);

      if (!user) {
        throw new UploadThingError('Unauthorized');
      }

      return { userId: user.id };
    })
    .onUploadComplete(async ({ file }) => {
      return {
        key: file.key,
        url: file.ufsUrl,
        name: file.name,
      };
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
