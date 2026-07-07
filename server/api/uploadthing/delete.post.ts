import { defineEventHandler, readBody } from 'h3';
import { UTApi } from 'uploadthing/server';

export default defineEventHandler(async (event) => {
  const { keys } = await readBody<{
    keys: string[];
  }>(event);

  if (!keys?.length) {
    return {
      success: true,
    };
  }

  await new UTApi().deleteFiles(keys);

  return {
    success: true,
  };
});
