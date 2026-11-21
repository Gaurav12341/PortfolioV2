import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/sections/work/case-study";
import { getProject, workProjects } from "@/content/projects";

export function generateStaticParams() {
  return workProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.oneLiner,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: { title: `${p.title} · Gaurav Raj`, description: p.oneLiner },
  };
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  return <CaseStudy project={p} />;
}
