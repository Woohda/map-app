/**
 * @module app/composables/useSeo
 * @fileoverview Composable для управления SEO мета тегами
 * @description
 * Этот composable предоставляет удобный интерфейс для установки SEO мета тегов
 * на страницах приложения с поддержкой Open Graph и Twitter Card.
 * ---
 * ### Логика работы:
 * 1. `Meta Tags`: Устанавливает базовые мета теги (description, robots)
 * 2. `Open Graph`: Добавляет OG теги для шаринга в социальных сетях
 * 3. `Twitter Cards`: Добавляет Twitter Card теги для Twitter
 * 4. `Canonical Links`: Устанавливает canonical URL для SEO
 * 5. `Default Values`: Использует дефолтные значения если параметры не переданы
 *
 * ### API:
 * - `useSeo(options)`: Функция для установки SEO мета тегов
 *
 * ### Параметры SeoOptions:
 * - `title?: string` - заголовок страницы (по умолчанию 'Map App - Карта локаций')
 * - `description?: string` - описание страницы (по умолчанию дефолтное описание)
 * - `image?: string` - путь к OG изображению (по умолчанию '/og-image.png')
 * - `url?: string` - канонический URL (по умолчанию текущий путь)
 * - `type?: 'website' | 'article' | 'profile'` - тип страницы (по умолчанию 'website')
 * - `noIndex?: boolean` - запрет индексации (по умолчанию false)
 *
 * ### Особенности:
 * - Автоматическая генерация canonical URL из route.path
 * - Поддержка Open Graph для Facebook, LinkedIn, etc.
 * - Поддержка Twitter Card (summary_large_image)
 * - Настройка robots meta тега (index/noindex)
 * - Theme color для мобильных браузеров
 *
 * ### Дефолтные значения:
 * - Title: 'Map App - Карта локаций'
 * - Description: 'Приложение для поиска и добавления локаций на карте...'
 * - Image: '/og-image.png'
 * - SiteUrl: из config.public.siteUrl или 'https://yourdomain.com'
 *
 * ### Примечания:
 * - Использует useHead для установки мета тегов
 * - Использует useSeoMeta для Nuxt SEO оптимизации
 * - URL изображения конкатенируется с siteUrl
 * - Canonical URL формируется автоматически из текущего route
 *
 * ### Зависимости:
 * - useRuntimeConfig из nuxt/app
 * - useRoute из vue-router
 * - useHead, useSeoMeta из nuxt/app
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
  const siteUrl
    = config.public.siteUrl || 'https://map-app-silk.vercel.app/';

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
