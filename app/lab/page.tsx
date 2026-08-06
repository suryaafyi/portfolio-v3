import type { Metadata } from "next";
import LabPage from "@/components/lab/LabPage";

export const metadata: Metadata = {
  title: "Lab — Surya",
  description:
    "Vibe-coded side quests, cooked purely for the lore. First batch is still on the burner.",
};

export default function Lab() {
  return (
    <>
      <LabPage />
    </>
  );
}
