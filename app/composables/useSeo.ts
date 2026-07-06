/**
 * @module composables/useSeo
 * @fileoverview Composable для управления SEO мета тегами
 * @description
 * Этот composable предоставляет удобный интерфейс для установки SEO мета тегов
 * на страницах приложения с поддержкой Open Graph и Twitter Card.
 */

interface SeoOptions {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  noIndex?: boolean;
}

export function useSeo(options: SeoOptions = {}) {
  const config = useRuntimeConfig();
  const route = useRoute();

  const defaultTitle = 'Map App - Карта локаций';
  const defaultDescription = 'Приложение для поиска и добавления локаций на карте. Делитесь своими любимыми местами с другими пользователями.';
  const defaultImage = '/og-image.png';
  const siteUrl = config.public.siteUrl || 'https://yourdomain.com';

  const title = options.title || defaultTitle;
  const description = options.description || defaultDescription;
  const image = options.image || defaultImage;
  const url = options.url || `${siteUrl}${route.path}`;
  const type = options.type || 'website';

  useHead({
    title,
    meta: [
      { name: 'description', content: description },
      { name: 'robots', content: options.noIndex ? 'noindex, nofollow' : 'index, follow' },

      // Open Graph
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: `${siteUrl}${image}` },
      { property: 'og:url', content: url },
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: 'Map App' },

      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: `${siteUrl}${image}` },

      // Additional
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#000000' },
    ],
    link: [
      { rel: 'canonical', href: url },
    ],
  });

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogImage: `${siteUrl}${image}`,
    ogUrl: url,
    ogType: type,
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: `${siteUrl}${image}`,
  });
}
