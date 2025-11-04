import type { InjectionKey } from 'vue';

export const FORM_ITEM_INJECTION_KEY
	= Symbol('Form item context') as InjectionKey<string>;
