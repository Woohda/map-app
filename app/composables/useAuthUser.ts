import type { User } from 'lucia';
import type { Ref } from 'vue';

import { useState } from 'nuxt/app';

export function useAuthUser(): Ref<User | null> {
	return useState<User | null>('currentUser', () => null);
}
