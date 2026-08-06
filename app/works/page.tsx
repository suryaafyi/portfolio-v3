import type { Metadata } from "next";
import SpiralGallery from "@/components/works/SpiralGallery";

export const metadata: Metadata = {
  title: "Works — Surya",
  description: "Selected works orbiting in a draggable 3D spiral. Drag, scroll, or switch to the index.",
};

export default function Works() {
  return (
    <>
      <h1 className="sr-only">Selected Works</h1>
      <SpiralGallery />
    </>
  );
}
