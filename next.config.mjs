/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    /* AVIF לפני WebP — דפדפן שתומך מקבל קובץ קטן יותר באותה איכות,
       והשאר נופלים ל-WebP כרגיל. */
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
