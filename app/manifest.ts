import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "VATify",
    short_name: "VATify",
    description: "Capture invoices and keep your VAT records organised.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#f7f9fc",
    theme_color: "#0a2463",
    orientation: "portrait",
    icons: [
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      { src: "/icon-light-32x32.png", sizes: "32x32", type: "image/png" },
    ],
  }
}
