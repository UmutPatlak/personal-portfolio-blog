import { Helmet } from 'react-helmet-async';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string | string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  noindex?: boolean;
}

const DEFAULT_TITLE = 'Umut Patlak — Full-Stack Developer | React, NestJS, Spring Boot';
const DEFAULT_DESCRIPTION =
  'Umut Patlak is a Full-Stack Developer based in Istanbul specializing in React, NestJS, TypeScript, Node.js, Spring Boot, PostgreSQL, and scalable modern web architecture.';
const DEFAULT_KEYWORDS = [
  'Umut Patlak',
  'Full-Stack Developer',
  'Software Engineer',
  'React',
  'NestJS',
  'TypeScript',
  'Node.js',
  'Spring Boot',
  'PostgreSQL',
  'Istanbul Developer',
  'Web Development',
  'Portfolio',
  'Blog',
  'TailwindCSS',
  'Frontend Developer',
  'Backend Developer',
  'Software Architecture',
].join(', ');

const DEFAULT_IMAGE = '/og-image.png';
const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://umutpatlak.com').replace(/\/$/, '');

export function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  image = DEFAULT_IMAGE,
  url = '',
  type = 'website',
  author = 'Umut Patlak',
  publishedTime,
  modifiedTime,
  tags,
  noindex = false,
}: SEOProps) {
  const fullTitle = title
    ? title.includes('Umut Patlak')
      ? title
      : `${title} | Umut Patlak`
    : DEFAULT_TITLE;

  const fullUrl = url ? (url.startsWith('http') ? url : `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`) : SITE_URL;
  const fullImage = image.startsWith('http') ? image : `${SITE_URL}${image.startsWith('/') ? '' : '/'}${image}`;
  const keywordsString = Array.isArray(keywords) ? keywords.join(', ') : keywords;

  return (
    <Helmet>
      {/* Primary HTML Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywordsString} />
      <meta name="author" content={author} />
      <link rel="canonical" href={fullUrl} />

      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* Open Graph / Facebook / LinkedIn */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Umut Patlak — Portfolio & Blog" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="tr_TR" />

      {/* Article Specific Meta */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      {type === 'article' &&
        tags?.map((tag) => (
          <meta property="article:tag" content={tag} key={tag} />
        ))}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:image:alt" content={fullTitle} />
      <meta name="twitter:creator" content="@umutpatlak" />
    </Helmet>
  );
}
