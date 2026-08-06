import type { Metadata } from "next";
import GuestbookPage from "@/components/guestbook/GuestbookPage";

export const metadata: Metadata = {
  title: "Guestbook — Surya",
  description:
    "Grab a visitor pass, doodle on it, sticker it, and pin it to the wall with everyone else’s.",
};

export default function Guestbook() {
  return <GuestbookPage />;
}
