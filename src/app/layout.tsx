import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Open_Sans } from "next/font/google";
import { BUSINESS } from "@/lib/content";
import { SITE_URL } from "@/lib/site";
import { GOOGLE_ADS_ID, GOOGLE_ANALYTICS_ID } from "@/lib/ads-conversion";
import AccessibilityWidget, { A11Y_BOOT_SCRIPT } from "@/components/AccessibilityWidget";
import LeadTracker from "@/components/LeadTracker";
import "./globals.css";

/* משפחה אחת לכל האתר: Open Sans. זה פונט משתנה, ולכן כל המשקלים (300 עד 800)
   מגיעים מקובץ אחד — כותרות וגוף חולקים אותו, והדפדפן טוען פחות.
   שני המשתנים נשארים כדי שה-CSS לא יצטרך להשתנות בכל מקום. */
const openSans = Open_Sans({
  subsets: ["hebrew", "latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

const TITLE = "AS digital — בניית אתרים, קידום אורגני ושיווק ממומן | אסף סאייג";
const DESCRIPTION =
  "אסף סאייג בונה אתרים ודפי נחיתה לעסקים, מקדם אותם בגוגל ובבינה המלאכותית ומנהל קמפיינים ממומנים. שש שנים בדיגיטל, ואתם מדברים איתו ישירות.";

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
    title: "AS digital — אתרים שמביאים פניות",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "AS digital — אתרים שמביאים פניות",
    description: "בניית אתרים, קידום בגוגל, שיווק ממומן ואוטומציות. אסף סאייג.",
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
  themeColor: "#f8f5f2",
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
      image: `${SITE_URL}/images/asaf-portrait.webp`,
      /* גוגל משתמש ב-logo לכרטיס הידע ולתוצאות המותג */
      logo: `${SITE_URL}/images/as-logo.png`,
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
      image: `${SITE_URL}/images/asaf-portrait.webp`,
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
      className={openSans.variable}
      suppressHydrationWarning
    >
      <head>
        {/* Google tag (gtag.js) — Google Ads ו-Google Analytics.
            next/script טוען אחרי ההידרציה כדי לא לחסום את הצביעה הראשונה. */}
        <Script
          id="gtag-src"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', '${GOOGLE_ADS_ID}');
gtag('config', '${GOOGLE_ANALYTICS_ID}');`}
        </Script>
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
        <LeadTracker />
        <AccessibilityWidget />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
