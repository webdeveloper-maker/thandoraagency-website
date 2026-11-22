// On GitHub Pages the site lives at /<repo-name>/, so the deploy workflow sets
// NEXT_PUBLIC_BASE_PATH=/thandoraagency-website. Locally it is empty.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
