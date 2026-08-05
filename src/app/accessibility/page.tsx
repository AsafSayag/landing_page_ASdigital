import type { Metadata } from "next";
import LegalDoc from "@/components/LegalDoc";
import { ACCESSIBILITY } from "@/lib/legal";

export const metadata: Metadata = {
  title: ACCESSIBILITY.title,
  description: ACCESSIBILITY.description,
  alternates: { canonical: ACCESSIBILITY.slug },
};

export default function AccessibilityPage() {
  return <LegalDoc doc={ACCESSIBILITY} />;
}
