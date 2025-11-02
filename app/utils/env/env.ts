/* eslint-disable node/no-process-env */
import { z } from 'zod';

import tryParseEnv from './try-parse-env';

const EnvSchema = z.object({
	NODE_ENV: z.string(),
	PRISMA_DATABASE_URL: z.string(),
});

export type EnvSchema = z.infer<typeof EnvSchema>;
tryParseEnv(EnvSchema);
export default EnvSchema.parse(process.env);
