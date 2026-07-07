import { uploadRouter } from '~server/uploadthing';
import { createRouteHandler } from 'uploadthing/h3';

export default createRouteHandler({
  router: uploadRouter,
});
