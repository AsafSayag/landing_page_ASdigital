import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Work from "@/components/Work";
import Services from "@/components/Services";
import About from "@/components/About";
import Contact from "@/components/Contact";
import SiteFooter from "@/components/SiteFooter";
import WhatsAppFab from "@/components/WhatsAppFab";
import ScrollReveal from "@/components/ScrollReveal";
import type { HeroVariant } from "@/lib/content";
import "@/components/site.css";

/* גוף העמוד המלא, משותף לכל הראוטים. ההבדל היחיד בין / לבין /marketing
   הוא נוסח ההירו — כל השאר זהה, ולכן הוא חי כאן פעם אחת ולא משוכפל.

   הסדר: הבטחה (hero) → תחומים (marquee) → הוכחה (work) → איך (services)
   → מי (about) → פעולה (contact). שישה מודולים, לא שלושה-עשר. */
export default function SitePage({ hero = "site" }: { hero?: HeroVariant }) {
  return (
    <>
      <Header />
      <main id="main">
        <Hero variant={hero} />
        <Marquee />
        <Work />
        <Services />
        <About />
        <Contact />
      </main>
      <SiteFooter />
      <WhatsAppFab />
      <ScrollReveal />
    </>
  );
}
