import { generateOrganizationSchema, generateWebsiteSchema } from "@/lib/seo";

/**
 * Component to inject structured data (JSON-LD) into the page
 */
export function StructuredData({ data }: { data: object | object[] }) {
  const jsonLd = Array.isArray(data) ? data : [data];

  return (
    <>
      {jsonLd.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}

/**
 * Default structured data for all pages (Organization + WebSite)
 */
export function DefaultStructuredData() {
  return (
    <StructuredData
      data={[generateOrganizationSchema(), generateWebsiteSchema()]}
    />
  );
}
