import { type Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sprintplanner.xyz";
const siteName = "SprintPlanner";
const defaultTitle =
  "SprintPlanner - Turning Ideas into Executable 4-Week Ventures";
const defaultDescription =
  "SprintPlanner helps you turn your ideas into executable 4-week ventures. Plan, execute, and track your venture with a focused framework designed for builders and investors.";

export interface SEOConfig {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageAlt?: string;
  noIndex?: boolean;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

/**
 * Generate comprehensive metadata for SEO
 */
export function generateMetadata(config: SEOConfig = {}): Metadata {
  const {
    title,
    description = defaultDescription,
    path = "",
    image = `${baseUrl}/og-image.png`, // Default to og-image.png, fallback to logo.svg
    imageWidth = 1200,
    imageHeight = 630,
    imageAlt,
    noIndex = false,
    keywords = [],
    type = "website",
    publishedTime,
    modifiedTime,
    author,
    section,
    tags = [],
  } = config;

  const fullTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const url = `${baseUrl}${path}`;
  const ogImage = image.startsWith("http") ? image : `${baseUrl}${image}`;
  const ogImageAlt = imageAlt || fullTitle;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords.join(", ") : undefined,
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    openGraph: {
      type,
      locale: "en_US",
      url,
      title: fullTitle,
      description,
      siteName,
      images: [
        {
          url: ogImage,
          width: imageWidth,
          height: imageHeight,
          alt: ogImageAlt,
          type: "image/png", // Default to PNG, can be overridden if needed
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(author && { authors: [author] }),
      ...(section && { section }),
      ...(tags.length > 0 && { tags }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [
        {
          url: ogImage,
          alt: ogImageAlt,
          width: imageWidth,
          height: imageHeight,
        },
      ],
      creator: "@sprintplanner", // Update with actual Twitter handle if available
      site: "@sprintplanner", // Update with actual Twitter handle if available
    },
    alternates: {
      canonical: url,
    },
    metadataBase: new URL(baseUrl),
  };

  return metadata;
}

/**
 * Generate JSON-LD structured data for Organization
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: baseUrl,
    logo: `${baseUrl}/logo.svg`,
    description: defaultDescription,
    sameAs: [
      // Add social media URLs when available
      // "https://twitter.com/sprintplanner",
      // "https://linkedin.com/company/sprintplanner",
    ],
  };
}

/**
 * Generate JSON-LD structured data for WebSite
 */
export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/ideas?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generate JSON-LD structured data for SoftwareApplication
 */
export function generateSoftwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteName,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: defaultDescription,
    url: baseUrl,
  };
}

/**
 * Generate JSON-LD structured data for FAQPage
 */
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate JSON-LD structured data for BreadcrumbList
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
