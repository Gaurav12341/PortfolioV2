import { BASE_URL, OG_IMAGE } from "@/lib/constants";

export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Gaurav Raj",
    url: BASE_URL,
    image: OG_IMAGE,
    description:
      "Backend Software Engineer building distributed systems and cloud platforms, with hands-on experience shipping production AI/RAG systems.",
    jobTitle: "Software Engineer I",
    worksFor: {
      "@type": "Organization",
      name: "Honeywell",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bengaluru",
      addressCountry: "IN",
    },
    sameAs: [
      "https://www.linkedin.com/in/gaurav-raj-405a96237/",
      "https://github.com/Gaurav12341",
      "https://leetcode.com/u/Gaurav2706/",
    ],
    knowsAbout: [
      "Backend Development",
      "Distributed Systems",
      "Cloud Platforms",
      "Microservices",
      "Kafka",
      "PostgreSQL",
      ".NET",
      "Python",
      "Retrieval-Augmented Generation",
      "AI Agents",
    ],
  };

  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Gaurav Raj Portfolio",
    url: BASE_URL,
    description:
      "Portfolio of Gaurav Raj, a Backend Software Engineer building distributed systems, cloud platforms, and production AI/RAG systems.",
    author: {
      "@type": "Person",
      name: "Gaurav Raj",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteStructuredData),
        }}
      />
    </>
  );
}
