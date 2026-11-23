import { BASE_URL, SOCIAL_LINKS } from "@/lib/constants";

/**
 * JSON-LD (PHASES.md Phase 8): a Person and the WebSite it belongs to.
 * Facts from PHASES.md §11 only.
 */
export default function StructuredData() {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${BASE_URL}/#person`,
    name: "Gaurav Raj",
    url: BASE_URL,
    image: `${BASE_URL}/images/portrait-anime.webp`,
    jobTitle: "Software Engineer",
    description:
      "Backend & AI Engineer building distributed systems and RAG pipelines that hold up under load.",
    worksFor: { "@type": "Organization", name: "Honeywell" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "SRM Institute of Science and Technology" },
    address: { "@type": "PostalAddress", addressLocality: "Bengaluru", addressCountry: "IN" },
    sameAs: SOCIAL_LINKS.map((l) => l.href),
    knowsAbout: [
      "Backend engineering",
      "Distributed systems",
      ".NET",
      "Kafka",
      "Kubernetes",
      "PostgreSQL",
      "Retrieval-augmented generation",
      "LLM evaluation",
    ],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    name: "Gaurav Raj",
    url: BASE_URL,
    author: { "@id": `${BASE_URL}/#person` },
  };

  /* "<" escaped so a value can never close the script tag */
  const json = (o: object) => JSON.stringify(o).replace(/</g, "\\u003c");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json(person) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json(website) }} />
    </>
  );
}
