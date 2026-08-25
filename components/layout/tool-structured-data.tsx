export function ToolStructuredData({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    url: `https://minecraftcirclegen.com${path}`,
    applicationCategory: "DesignApplication",
    operatingSystem: "Any",
    description,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
