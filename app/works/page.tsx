import type { Metadata } from "next";
import DockNav from "@/components/DockNav";
import SpiralGallery from "@/components/works/SpiralGallery";
import HuntSticker from "@/components/hunt/HuntSticker";

export const metadata: Metadata = {
  title: "Works — Surya",
  description: "Selected works orbiting in a draggable 3D spiral. Drag, scroll, or switch to the index.",
};

export default function Works() {
  return (
    <>
      <h1 className="sr-only">Selected Works</h1>
      <SpiralGallery />
      <HuntSticker id="works" className="hunt-spot-works" />
      <DockNav />
    </>
  );
}
