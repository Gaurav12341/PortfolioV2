import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Gaurav Raj · Backend & AI Engineer",
    short_name: "Gaurav Raj",
    description: "Backend & AI Engineer. Distributed systems and RAG pipelines that hold up under load.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0a0d",
    theme_color: "#0b0a0d",
    icons: [
      { src: "/icon/medium", sizes: "192x192", type: "image/png" },
      { src: "/icon/large", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
