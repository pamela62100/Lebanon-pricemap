import { Helmet } from '@dr.pogodin/react-helmet';

const SITE_NAME = 'WeinArkhass';
const SITE_URL = 'https://weinarkhass.com';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
  type?: 'website' | 'article' | 'product';
  jsonLd?: Record<string, unknown>;
  noIndex?: boolean;
}

export function Seo({
  title,
  description,
  image = DEFAULT_IMAGE,
  path = '',
  type = 'website',
  jsonLd,
  noIndex = false,
}: SeoProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Compare Live Prices Across Lebanon`;
  const desc = description ?? 'Find the cheapest groceries, fuel and essentials across Lebanon. Verified prices from trusted retailers.';
  const url = `${SITE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={image} />

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
