import type { Metadata } from "next";
import LegalDoc from "@/components/LegalDoc";
import { TERMS } from "@/lib/legal";

export const metadata: Metadata = {
  title: TERMS.title,
  description: TERMS.description,
  alternates: { canonical: TERMS.slug },
};

export default function TermsPage() {
  return <LegalDoc doc={TERMS} />;
}
