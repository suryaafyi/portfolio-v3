import type { Metadata } from "next";
import ContactPage from "@/components/contact/ContactPage";

export const metadata: Metadata = {
  title: "Contact — Surya",
  description: "Post your idea my way — I read every letter that lands here.",
};

export default function Contact() {
  return <ContactPage />;
}
