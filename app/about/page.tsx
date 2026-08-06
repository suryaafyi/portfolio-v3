import type { Metadata } from "next";
import AboutPage from "@/components/about/AboutPage";

export const metadata: Metadata = {
  title: "About — Surya",
  description:
    "Surya — a product designer and full-stack developer who came to design through code. Engineer first, designer on purpose.",
};

export default function About() {
  return (
    <>
      <AboutPage />
    </>
  );
}
