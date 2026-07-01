import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROJECTS } from "@/lib/projects";
import { getCaseStudy } from "@/lib/case-studies";
import ProjectDetail from "@/components/works/ProjectDetail";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const proj = PROJECTS.find((p) => p.slug === slug);
  const study = getCaseStudy(slug);
  if (!proj || !study) return {};
  return { title: `${proj.name} — Surya`, description: study.title };
}

export default async function WorkDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  const i = PROJECTS.findIndex((p) => p.slug === slug);
  if (!study || i < 0) notFound();

  const nextProj = PROJECTS[(i + 1) % PROJECTS.length];
  const nextStudy = getCaseStudy(nextProj.slug);

  return (
    <ProjectDetail
      study={study}
      name={PROJECTS[i].name}
      next={{ slug: nextProj.slug, name: nextProj.name, accent: nextStudy?.accent ?? "#4A6FA5" }}
    />
  );
}
