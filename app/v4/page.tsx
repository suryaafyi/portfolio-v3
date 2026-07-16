import type { Metadata } from "next";
import V4Home from "@/components/v4/V4Home";

export const metadata: Metadata = {
  title: "Surya© — design direction prototype",
  description: "Prototype of the v4 design direction. Not the live site.",
  robots: { index: false },
};

export default function V4() {
  return <V4Home />;
}
