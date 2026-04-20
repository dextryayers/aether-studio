import React from "react";
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  keywords?: string;
}

export const SEO: React.FC<SEOProps> = ({ 
  title, 
  description = "Hanif Abdurrohim - Aether Studio | Lead Bug Hunter & Web Developer. Expert in cybersecurity recon, full-stack engineering, and digital architecture.",
  path = "", 
  image = "/CV.jpg",
  keywords
}) => {
  const siteName = "Hanif Abdurrohim | Aether Studio";
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const baseUrl = "https://haniplabs.com"; 
  const url = `${baseUrl}${path}`;

  const getDynamicKeywords = (currentPath: string) => {
    const core = [
      "Hanif Abdurrohim",
      "Aether Studio",
      "haniplabs",
      "haniplabs.com",
      "Bug Hunter",
      "Web Developer",
      "Cybersecurity Surabaya",
      "Penetration Testing Indonesia",
      "Ethical Hacking",
      "Security Researcher"
    ];

    const cleanPath = currentPath.split("?")[0].replace(/\/$/, "");

    if (cleanPath.startsWith("/lab")) {
      const labKeywords = [...core, "Developer Utilities", "CSS Architect Game", "Spatial Coding Challenge", "Markdown Live Preview", "CSS Color Scale Generator", "Technical Sandbox", "Aether Lab Sector", "Dev Tools Suite", "CSS Learning Game"];
      if (cleanPath.includes("css-playing")) return [...labKeywords, "CSS Game", "CSS Challenges", "Learn CSS Grid", "CSS Flexbox Game", "Visual CSS Training"].join(", ");
      if (cleanPath.includes("md-preview")) return [...labKeywords, "Markdown Editor", "GitHub Flavored Markdown", "GFM Online", "Markdown Visualizer", "Live MD Preview"].join(", ");
      if (cleanPath.includes("css-palette")) return [...labKeywords, "Color Palette Generator", "CSS Gradient Tool", "Tailwind Color Scale", "UX Design Colors", "Modern Web Palettes"].join(", ");
      return labKeywords.join(", ");
    }
    if (cleanPath === "/work") {
      return [...core, "Software Engineering Portfolio", "Web Application Development", "Cybersecurity Projects", "Bug Bounty Experience", "Full Stack Development Portfolio", "Case Studies", "Selected Reconnaissance"].join(", ");
    }
    if (cleanPath === "/services") {
      return [...core, "Professional Penetration Testing", "Vulnerability Assessment", "Secure Web Development", "UI/UX Design", "Cybersecurity Consultation", "Risk Management"].join(", ");
    }
    if (cleanPath === "/about") {
      return [...core, "Hanif Abdurrohim Background", "Cybersecurity Certifications", "Technical Skills", "Security Researcher Biography", "IT Professional Indonesia"].join(", ");
    }
    if (cleanPath === "/contact") {
      return [...core, "Hire Cybersecurity Expert", "Work with Aether Studio", "Project Inquiry", "Collaboration Request", "Business Contact"].join(", ");
    }
    if (cleanPath === "/chat") {
      return [...core, "AI Portfolio Assistant", "Interactive Chat Experience", "Gemini AI Demo", "Portfolio Inquiry Bot"].join(", ");
    }
    if (cleanPath === "/resume") {
      return [...core, "Cybersecurity Resume", "Web Developer CV", "Professional Experience", "Technical Education", "Bug Bounty Achievements"].join(", ");
    }
    
    return [...core, "Portfolio Cybersecurity", "Web Engineering", "Digital Architecture", "Full Stack Developer"].join(", ");
  };

  const finalKeywords = keywords || getDynamicKeywords(path);

  // Structured Data for Person/Entity
  const personData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Hanif Abdurrohim",
    "alternateName": "Hanif Abdurrohim Aether",
    "url": baseUrl,
    "image": `${baseUrl}/CV.jpg`,
    "jobTitle": "Bug Hunter & Web Developer",
    "description": description,
    "worksFor": {
      "@type": "Organization",
      "name": "Aether Studio",
      "url": baseUrl
    },
    "sameAs": [
      "https://github.com/dextryayers",
      "https://linkedin.com/in/hanif-abdurrohim"
    ],
    "knowsAbout": ["Cybersecurity", "Web Development", "Bug Bounty", "Penetration Testing", "React", "Next.js", "Vulnerability Research", "OWASP Top 10", "Digital Reconnaissance", "Cloud Security", "Full Stack Architecture"]
  };

  // Structured Data for Website Search
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Hanip Labs",
    "url": baseUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${baseUrl}/work?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Person",
      "name": "Hanif Abdurrohim"
    }
  };

  // Structured Data for Organization
  const orgData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Aether Studio",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
    "founder": personData,
    "foundingDate": "2023",
    "description": "High-fidelity digital design and cybersecurity engineering firm specialized in creative reconnaissance and structural system development."
  };

  // Structured Data for Professional Service
  const serviceData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Aether Studio",
    "image": `${baseUrl}/CV.jpg`,
    "url": baseUrl,
    "telephone": "",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Surabaya",
      "addressRegion": "East Java",
      "addressCountry": "Indonesia"
    },
    "priceRange": "$$$",
    "founder": "Hanif Abdurrohim",
    "knowsAbout": ["Cybersecurity", "Web Development", "Bug Hunting", "Penetration Testing"],
    "openingHours": "Mo-Fr 09:00-18:00"
  };

  // Breadcrumb Data
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      path && {
        "@type": "ListItem",
        "position": 2,
        "name": path.replace("/", "").charAt(0).toUpperCase() + path.slice(2),
        "item": `${baseUrl}${path}`
      }
    ].filter(Boolean)
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      
      {/* Language Tags (Hreflang) */}
      <link rel="alternate" href={url} hrefLang="en" />
      <link rel="alternate" href={url} hrefLang="id" />
      <link rel="alternate" href={url} hrefLang="x-default" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional SEO Pins */}
      <meta name="author" content="Hanif Abdurrohim" />
      <meta name="copyright" content={`© ${new Date().getFullYear()} Aether Studio`} />
      <meta name="theme-color" content="#020617" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

      {/* Meta Keywords */}
      <meta name="keywords" content={finalKeywords} />

      {/* Structured Data Scripts */}
      <script type="application/ld+json">{JSON.stringify(personData)}</script>
      <script type="application/ld+json">{JSON.stringify(websiteData)}</script>
      <script type="application/ld+json">{JSON.stringify(orgData)}</script>
      <script type="application/ld+json">{JSON.stringify(serviceData)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumbData)}</script>
    </Helmet>
  );
};
