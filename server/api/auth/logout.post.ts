import type { H3Event } from 'h3';

import { createNewSessionCookie, lucia, validateRequest } from '~server/utils/auth';

export default defineEventHandler(async (event: H3Event) => {
	const { session } = await validateRequest(event);
	if (!session)
		return;
	await lucia.invalidateSession(session.id);

	await createNewSessionCookie(event);
});
