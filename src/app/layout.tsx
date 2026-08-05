import type { Metadata, Viewport } from "next";
import { Frank_Ruhl_Libre, IBM_Plex_Sans_Hebrew } from "next/font/google";
import { BUSINESS } from "@/lib/content";
import { SITE_URL } from "@/lib/site";
import AccessibilityWidget, { A11Y_BOOT_SCRIPT } from "@/components/AccessibilityWidget";
import "./globals.css";

/* כותרות: Frank Ruhl Libre — סריף עברי אלגנטי שמשדר אמינות ויוקרה.
   גוף: IBM Plex Sans Hebrew — סאנס עברי מקצועי ומדויק. */
const display = Frank_Ruhl_Libre({
  subsets: ["hebrew", "latin"],
  variable: "--font-display",
  display: "swap",
  preload: true,
});

const body = IBM_Plex_Sans_Hebrew({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
  preload: true,
});

const TITLE = "AS digital — בניית אתרים, קידום אורגני ושיווק ממומן | אסף סאייג";
const DESCRIPTION =
  "אסף סאייג, מומחה דיגיטל ו-AI עם 6+ שנות ניסיון. בניית אתרים מהירים, קידום אורגני בגוגל ובבינה מלאכותית, שיווק ממומן ואוטומציות שמייצרות לקוחות.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | AS digital",
  },
  description: DESCRIPTION,
  applicationName: BUSINESS.name,
  keywords: [
    "בניית אתרים",
    "קידום אורגני",
    "קידום בגוגל",
    "שיווק ממומן",
    "שיווק דיגיטלי",
    "אוטומציות",
    "בינה מלאכותית",
    "דפי נחיתה",
    "אסף סאייג",
    "AS digital",
  ],
  authors: [{ name: BUSINESS.owner }],
  creator: BUSINESS.owner,
  publisher: BUSINESS.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "he_IL",
    url: SITE_URL,
    siteName: BUSINESS.name,
    title: "AS digital — נוכחות דיגיטלית שמייצרת לקוחות",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "AS digital — נוכחות דיגיטלית שמייצרת לקוחות",
    description: "בניית אתרים, קידום אורגני, שיווק ממומן ו-AI. אסף סאייג.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { telephone: true, email: true, address: true },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#business`,
      name: BUSINESS.name,
      description: DESCRIPTION,
      url: SITE_URL,
      telephone: "+972-54-766-4809",
      email: BUSINESS.email,
      image: `${SITE_URL}/video/process-poster.jpg`,
      priceRange: "$$",
      areaServed: { "@type": "Country", name: "IL" },
      address: {
        "@type": "PostalAddress",
        streetAddress: "המתכת 8",
        addressLocality: "קדימה צורן",
        addressCountry: "IL",
      },
      founder: { "@id": `${SITE_URL}/#asaf` },
      knowsAbout: [
        "בניית אתרים",
        "קידום אורגני",
        "שיווק ממומן",
        "בינה מלאכותית",
        "אוטומציות שיווק",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "שירותים",
        itemListElement: [
          "בניית אתרים ודפי נחיתה",
          "קידום אורגני בגוגל",
          "קידום בבינה מלאכותית",
          "שיווק ממומן בגוגל ומטא",
          "תוכן ואנליטיקה",
          "אוטומציות ו-AI",
        ].map((name) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name },
        })),
      },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#asaf`,
      name: BUSINESS.owner,
      jobTitle: BUSINESS.role,
      worksFor: { "@id": `${SITE_URL}/#business` },
      url: SITE_URL,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: BUSINESS.name,
      inLanguage: "he-IL",
      publisher: { "@id": `${SITE_URL}/#business` },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning: סקריפט האתחול של הנגישות מוסיף מחלקות ל-<html>
    // לפני ההידרציה, ולכן ה-HTML מהשרת לעולם לא יתאים למצב בדפדפן. ההשתקה
    // חלה על רמה אחת בלבד — על התכונות של האלמנט הזה.
    <html
      lang="he"
      dir="rtl"
      className={`${display.variable} ${body.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* מחיל הגדרות נגישות שמורות לפני הצביעה הראשונה — בלי זה משתמש
            שהגדיל טקסט היה רואה הבזק של הגודל המקורי בכל טעינת עמוד. */}
        <script dangerouslySetInnerHTML={{ __html: A11Y_BOOT_SCRIPT }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          דלגו לתוכן הראשי
        </a>
        {children}
        <AccessibilityWidget />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
