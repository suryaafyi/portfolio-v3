import type { Metadata } from "next";
import DotField from "@/components/DotField";
import DockNav from "@/components/DockNav";
import Cursor from "@/components/Cursor";
import ContactPage from "@/components/contact/ContactPage";

export const metadata: Metadata = {
  title: "Contact — Surya",
  description: "Post your idea my way — I read every letter that lands here.",
};

export default function Contact() {
  return (
    <>
      <DotField />
      <ContactPage />
      <DockNav />
      <Cursor />
    </>
  );
}
