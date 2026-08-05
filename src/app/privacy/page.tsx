import type { Metadata } from "next";
import LegalDoc from "@/components/LegalDoc";
import { PRIVACY } from "@/lib/legal";

export const metadata: Metadata = {
  title: PRIVACY.title,
  description: PRIVACY.description,
  alternates: { canonical: PRIVACY.slug },
};

export default function PrivacyPage() {
  return <LegalDoc doc={PRIVACY} />;
}
