import WorksTransition from "@/components/works/WorksTransition";

// Wraps /works and /works/[slug]. WorksTransition persists across navigation
// between them, so the blue "flash" curtain and the custom cursor survive the
// route change.
export default function WorksLayout({ children }: { children: React.ReactNode }) {
  return <WorksTransition>{children}</WorksTransition>;
}
