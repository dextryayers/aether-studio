import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "id";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved as Language) || "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    const keys = key.split(".");
    let current: any = translations[language];

    for (const k of keys) {
      if (current[k] === undefined) {
        console.warn(`Translation key not found: ${key} for language: ${language}`);
        return key;
      }
      current = current[k];
    }

    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

const translations: Record<Language, any> = {
  en: {
    seo: {
      home: { title: "Hanif Abdurrohim | Aether Studio - Lead Bug Hunter & Web Dev", desc: "Hanif Abdurrohim's official portfolio at Aether Studio. Expert in web security, bug hunting, and fullstack engineering." },
      work: { title: "Projects & Recon | Hanif Abdurrohim", desc: "Detailed showcase of cybersecurity projects, research, and high-performance digital creations by Hanif Abdurrohim." },
      services: { title: "Capabilities | Aether Studio", desc: "Professional services including Penetration Testing, Bug Bounty programs, and Custom Web Engineering by Hanif Abdurrohim." },
      about: { title: "Dossier | Hanif Abdurrohim", desc: "The strategic vision and professional history of Hanif Abdurrohim, digital architect at Aether Studio." },
      contact: { title: "Consultation | Hanif Abdurrohim", desc: "Secure a strategic consultation for digital security or product development with Hanif Abdurrohim." },
      resume: { title: "Professional CV | Hanif Abdurrohim", desc: "Download the complete professional resume of Hanif Abdurrohim, Bug Hunter and Web Developer." },
      lab: { title: "Systems Lab | Aether Studio", desc: "A collection of high-performance technical utilities for developers and security researchers." }
    },
    lab: {
      sector: "Experimental Sector",
      title: "SYSTEMS",
      subtitle: "LAB",
      description: "A private collection of technical utilities and internal tools engineered for rapid deployment during development and architectural recon.",
      md: {
        title: "Markdown Preview",
        desc: "Live rendering of GFM markdown with technical code highlighting and styling."
      },
      color: {
        title: "Color Generator",
        desc: "Generate harmonic palette scales and technical CSS color variables."
      },
      cssPlaying: {
        title: "CSS Architect",
        desc: "Precision code challenge. Navigate objects to targets using raw CSS directives across 5 difficulty tiers."
      },
      footer: "Archive Link: ACTIVE_SESSION_LAB",
      framework: "Experimental Framework v4.2.0"
    },
    nav: {
      home: "Home",
      work: "Work",
      services: "Services",
      about: "About",
      chat: "AI Chat",
      resume: "Resume",
      lab: "Systems Lab",
      contact: "Contact",
    },
    hero: {
      subtitle: "CREATIVE STUDIO",
      title: "DIGITAL",
      titleItalic: "DESIGN",
      titleEnd: "EXPERIENCE",
      description: "Hanif Abdurrohim and Aether Studio synthesize visionary concepts into high-fidelity technical reality with absolute precision and cybersecurity expertise.",
      cta: "Explore Portfolio",
    },
    common: {
      creativeStudio: "Creative Studio",
      scroll: "Scroll",
      partnership: "Collaborate",
      follow: "Connect",
      deliveries: "Project Deployments",
      yearsXp: "Years of Expertise",
      retention: "Success Rate",
      digitalFuture: "Strategic Digital Future",
      categories: {
        all: "All",
        product: "Product",
        brand: "Brand",
        web: "Web",
        mobile: "Mobile",
      }
    },
    home: {
      techStack: "TECHNICAL STACK",
      techTitle: "WORLD-CLASS ARCHITECTURE FOR",
      techTitleEnd: "HIGH-FIDELITY RESULTS",
      ctaTitle: "READY TO",
      ctaItalic: "SYNTHESIZE",
      ctaEnd: "THE FUTURE?",
      ctaDesc: "Let's engineer your most ambitious visions into technical reality.",
      ctaButton: "Initialize Session",
    },
    work: {
      selected: "CURATED",
      works: "PROJECTS",
      descriptionTitle: "A showcase of high-performance technical solutions.",
      description: "We engineer category-defining products for visionary disruptors.",
      scrollExplore: "Explore",
      featured: "Featured Recon",
      archive: "System Archive",
      visionTitle: "LET'S BUILD",
      viewAll: "Access All",
      present: "PRESENT",
    },
    projects: {
      p1: { desc: "High-security fintech architecture optimized for structural integrity." },
      p2: { desc: "Cohesive digital identity engineered for climate-tech scalability." },
      p3: { desc: "Enterprise analytical interface for deep strategic insights." },
      p4: { desc: "AI-driven wellness infrastructure for personalized optimization." },
      p5: { desc: "Immersive virtual commerce environment with high-fidelity interactions." },
      p6: { desc: "Visual framework for advanced robotics research systems." },
    },
    services: {
      capabilities: "CAPABILITIES",
      title: "TECHNICAL",
      titleItalic: "PROTOCOL",
      craft: "EXPERTISE",
      description: "Merging imaginative concepts with rigorous technical execution.",
      execution: "Execution Framework",
      way: "METHODOLOGY",
      wayDesc: "Optimized for maximum efficiency and architectural precision.",
      steps: {
        s1Title: "Strategy",
        s1Desc: "Analytical modeling for a secure and resilient foundation.",
        s2Title: "Architecture",
        s2Desc: "High-fidelity digital structures optimized for performance.",
        s3Title: "Synthesis",
        s3Desc: "The intersection of engineering logic and artistic integrity.",
        s4Title: "Evolution",
        s4Desc: "Persistent iteration using real-time performance metrics.",
      },
      quote: "Precision is our only standard.",
      elevate: "ENHANCE YOUR DIGITAL FOOTPRINT.",
    },
    contact: {
      conversation: "CONSULTATION",
      hello: "ENGAGE",
      description: "Secure communication active. Ready for strategic deployment.",
      synaptic: "Networks",
      correspondence: "Transmission",
      frequency: "Telemetry",
      coordinates: "Location",
      address: "Jl. Kalilom Lor Indah Gg. Pacar, Surabaya, East Java 60129",
      phone: "+62 823-3243-0578",
      city: "Surabaya, Indonesia",
      cycle: "Active Hours",
      monFri: "Mon — Fri",
      globalOps: "Global Synchrony",
      transmission: "Transmit",
      form: {
        journey: "INITIALIZE PROJECT",
        firstName: "Given Name",
        lastName: "Surname",
        email: "Encryption Point",
        classification: "Protocol Category",
        brief: "Strategic Brief",
        placeholderBrief: "Outline your visionary concept...",
        options: {
          fullProduct: "Full Product",
          branding: "Digital Identity",
          neuralUI: "Web/UI Sync",
          consultation: "Strategic Recon",
        }
      }
    },
    about: {
      weAre: "IDENTITY",
      manifesto: "MANIFESTO",
      title: "PRECISION DEFINES",
      titleItalic: "AUTHENTICITY",
      description: "Established in 2023, Aether is a strategic collective dedicated to high-fidelity interactions and design integrity.",
      heroTitle: "CONSTRUCTING DIGITAL FUTURES WITH ABSOLUTE PRECISION.",
      manifestoSub1: "We maintain that exceptional results arise from the synthesis of rigorous logic and infinite creativity.",
      manifestoSub2: "Every structural element, transition, and variable represents a deliberate choice to optimize the user experience.",
      values: {
        v1: "Logic",
        v1Desc: "An unwavering commitment to structural integrity in every deployment.",
        v2: "Agility",
        v2Desc: "Dynamic experiences that are both fluid and highly resilient.",
        v3: "Synergy",
        v3Desc: "Global collaboration with visionary architects across frontiers.",
        v4: "Disruption",
        v4Desc: "Conceptualizing and building unprecedented technical solutions.",
      },
      stats: {
        projects: "Successful Deployments",
        experience: "Years of Expertise",
        awards: "Technical Recognition",
        retention: "Continuity Rate",
      },
      footer: "RE-ENGINEER THE IMPOSSIBLE."
    },
    servicesSection: {
      title: "CORE",
      italic: "SYSTEMS",
      subtitle: "CAPABILITIES",
      description: "Helping disruptors navigate the digital landscape with technical precision.",
      items: {
        s1: { title: "Technical Design", desc: "User-centric interface systems that balance aesthetics with high-fidelity logic." },
        s2: { title: "App Engineering", desc: "Performant, scalable systems built with modern frameworks and resilient architecture." },
        s3: { title: "Neural UI", desc: "Smart interaction layers that provide seamless connectivity across all endpoints." },
        s4: { title: "Strategic Recon", desc: "Optimization of digital presence through data-driven performance analysis." },
      }
    },
    chat: {
      header: "Aether AI",
      neural: "Strategic Intelligence Interface",
      active: "Network Link Active",
      unleash: "ENGINEER",
      pulse: "YOUR VISION",
      description: "I am your strategic intelligence layer, engineered for disruptive logic and creative precision.",
      placeholder: "Commence strategic inquiry...",
      suggestions: [
        "Who is the principal architect?",
        "Propose a disruptive strategy for fintech.",
        "Detail Aether's precision methodology.",
        "Architect a concept for an AI visual lab."
      ],
      error: "Communication link unstable. Please re-initialize the terminal."
    }
  },
  id: {
    seo: {
      home: { title: "Hanif Abdurrohim | Aether Studio - Arsitek Bug Hunter & Web Dev", desc: "Portofolio teknis Hanif Abdurrohim di Aether Studio. Spesialis keamanan siber, bug hunting, dan rekayasa web fullstack." },
      work: { title: "Proyek & Recon | Hanif Abdurrohim", desc: "Koleksi proyek keamanan siber, riset sistem, dan pengembangan platform digital oleh Hanif Abdurrohim." },
      services: { title: "Kapabilitas | Aether Studio", desc: "Layanan profesional mencakup Penetration Testing, Bug Bounty, dan rekayasa web kustom oleh Hanif Abdurrohim." },
      about: { title: "Identitas | Hanif Abdurrohim", desc: "Visi strategis dan sejarah profesional Hanif Abdurrohim, arsitek digital di Aether Studio." },
      contact: { title: "Konsultasi | Hanif Abdurrohim", desc: "Mulai konsultasi strategis untuk keamanan digital atau pengembangan produk dengan Hanif Abdurrohim." },
      resume: { title: "CV Profesional | Hanif Abdurrohim", desc: "Unduh resume profesional lengkap Hanif Abdurrohim, Bug Hunter dan Web Developer." },
      lab: { title: "Sistem Lab | Aether Studio", desc: "Kumpulan utilitas teknis berperforma tinggi untuk pengembang dan peneliti keamanan." }
    },
    lab: {
      sector: "Sektor Eksperimental",
      title: "SISTEM",
      subtitle: "LAB",
      description: "Kumpulan utilitas teknis privasi dan alat internal yang dirancang untuk penyebaran cepat selama pengembangan dan pengintaian arsitektur.",
      md: {
        title: "Markdown Preview",
        desc: "Rendering langsung markdown GFM dengan penyorotan kode teknis dan gaya."
      },
      color: {
        title: "Color Generator",
        desc: "Hasilkan skala palet harmonis dan variabel warna CSS teknis."
      },
      cssPlaying: {
        title: "Arsitek CSS",
        desc: "Tantangan kode presisi. Navigasikan objek ke target menggunakan arahan CSS mentah di 5 tingkatan kesulitan."
      },
      footer: "Tautan Arsip: SESI_AKTIF_LAB",
      framework: "Kerangka Eksperimental v4.2.0"
    },
    nav: {
      home: "Beranda",
      work: "Karya",
      services: "Layanan",
      about: "Identitas",
      chat: "AI Chat",
      resume: "Resume",
      lab: "Sistem Lab",
      contact: "Hubungi",
    },
    hero: {
      subtitle: "STUDIO KREATIF",
      title: "DESAIN",
      titleItalic: "PENGALAMAN",
      titleEnd: "DIGITAL",
      description: "Hanif Abdurrohim dan Aether Studio menyatukan konsep visioner menjadi realitas teknis dengan presisi mutlak dan keahlian keamanan siber.",
      cta: "Akses Portofolio",
    },
    common: {
      creativeStudio: "Studio Kreatif",
      scroll: "Gulir",
      partnership: "Sinergi",
      follow: "Terhubung",
      deliveries: "Implementasi Proyek",
      yearsXp: "Tahun Keahlian",
      retention: "Tingkat Keberhasilan",
      digitalFuture: "Masa Depan Strategis",
      categories: {
        all: "Semua",
        product: "Produk",
        brand: "Merek",
        web: "Web",
        mobile: "Seluler",
      }
    },
    home: {
      techStack: "STAK TEKNIS",
      techTitle: "ARSITEKTUR KELAS DUNIA UNTUK",
      techTitleEnd: "HASIL FIDELITAS TINGGI",
      ctaTitle: "SIAP UNTUK",
      ctaItalic: "MENYINTESIS",
      ctaEnd: "MASA DEPAN?",
      ctaDesc: "Mari kita rekayasa visi paling ambisius Anda menjadi realitas teknis berkualitas tinggi.",
      ctaButton: "Inisialisasi Sesi",
    },
    work: {
      selected: "KURASI",
      works: "PROYEK",
      descriptionTitle: "Kurasi solusi teknis berperforma tinggi.",
      description: "Kami merekayasa produk inovatif untuk para disruptor visioner.",
      scrollExplore: "Eksplorasi",
      featured: "Featured Recon",
      archive: "Arsip Sistem",
      visionTitle: "MARI MULAI",
      viewAll: "Akses Semua",
      present: "SEKARANG",
    },
    projects: {
      p1: { desc: "Arsitektur fintech keamanan tinggi yang dioptimalkan untuk integritas struktural." },
      p2: { desc: "Identitas digital kohesif yang dirancang untuk skalabilitas teknologi iklim." },
      p3: { desc: "Antarmuka analitik perusahaan untuk wawasan strategis yang mendalam." },
      p4: { desc: "Infrastruktur kesehatan berbasis AI untuk optimalisasi personal." },
      p5: { desc: "Lingkungan perdagangan virtual imersif dengan interaksi fidelitas tinggi." },
      p6: { desc: "Kerangka visual untuk sistem riset robotika tingkat lanjut." },
    },
    services: {
      capabilities: "KAPABILITAS",
      title: "PROTOKOL",
      titleItalic: "TEKNIS",
      craft: "KEAHLIAN",
      description: "Menggabungkan konsep imajinatif dengan eksekusi teknis yang ketat.",
      execution: "Kerangka Eksekusi",
      way: "METODOLOGI",
      wayDesc: "Dioptimalkan untuk efisiensi maksimum dan presisi arsitektural.",
      steps: {
        s1Title: "Strategi",
        s1Desc: "Pemodelan analitik untuk fondasi yang aman dan tangguh.",
        s2Title: "Arsitektur",
        s2Desc: "Struktur digital fidelitas tinggi yang dioptimalkan untuk performa.",
        s3Title: "Sintesis",
        s3Desc: "Titik temu logika rekayasa dan integritas artistik.",
        s4Title: "Evolusi",
        s4Desc: "Iterasi persisten menggunakan metrik performa real-time.",
      },
      quote: "Presisi adalah satu-satunya standar kami.",
      elevate: "TINGKATKAN JEJAK DIGITAL ANDA.",
    },
    contact: {
      conversation: "KONSULTASI",
      hello: "HUBUNGI",
      description: "Komunikasi aman aktif. Siap untuk implementasi strategis.",
      synaptic: "Jaringan",
      correspondence: "Transmisi",
      frequency: "Telemetri",
      coordinates: "Lokasi",
      address: "Jl. Kalilom Lor Indah Gg. Pacar, Surabaya, Jawa Timur 60129",
      phone: "+62 823-3243-0578",
      city: "Surabaya, Indonesia",
      cycle: "Jam Aktif",
      monFri: "Sen — Jum",
      globalOps: "Sinkroni Global",
      transmission: "Transmisikan",
      form: {
        journey: "INISIALISASI PROYEK",
        firstName: "Nama Depan",
        lastName: "Nama Belakang",
        email: "Titik Enkripsi",
        classification: "Kategori Protokol",
        brief: "Brief Strategis",
        placeholderBrief: "Garis bawahi konsep visioner Anda...",
        options: {
          fullProduct: "Produk Lengkap",
          branding: "Identitas Digital",
          neuralUI: "Sinkronisasi Web/UI",
          consultation: "Recon Strategis",
        }
      }
    },
    about: {
      weAre: "IDENTITAS",
      manifesto: "MANIFESTO",
      title: "PRESISI MENENTUKAN",
      titleItalic: "AUTENTISITAS",
      description: "Didirikan pada 2023, Aether adalah kolektif strategis yang berdedikasi pada interaksi fidelitas tinggi dan integritas desain.",
      heroTitle: "MENGKONSTRUKSI MASA DEPAN DIGITAL DENGAN PRESISI MUTLAK.",
      manifestoSub1: "Kami percaya hasil luar biasa lahir dari sintesis logika yang ketat dan kreativitas tanpa batas.",
      manifestoSub2: "Setiap elemen struktural, transisi, dan variabel merupakan pilihan sadar untuk mengoptimalkan pengalaman pengguna.",
      values: {
        v1: "Logika",
        v1Desc: "Komitmen teguh pada integritas struktural dalam setiap implementasi.",
        v2: "Agilitas",
        v2Desc: "Pengalaman dinamis yang cair namun sangat tangguh.",
        v3: "Sinergi",
        v3Desc: "Kolaborasi global dengan arsitek visioner melampaui batas.",
        v4: "Disrupsi",
        v4Desc: "Mengonsep dan membangun solusi teknis yang belum pernah ada sebelumnya.",
      },
      stats: {
        projects: "Implementasi Berhasil",
        experience: "Tahun Keahlian",
        awards: "Pengakuan Teknis",
        retention: "Tingkat Kontinuitas",
      },
      footer: "REKAYASA ULANG HAL YANG MUSTAHIL."
    },
    servicesSection: {
      title: "SISTEM",
      italic: "INTI",
      subtitle: "KAPABILITAS",
      description: "Membantu disruptor menavigasi lanskap digital dengan presisi teknis.",
      items: {
        s1: { title: "Desain Teknis", desc: "Sistem antarmuka berpusat pada pengguna yang menyeimbangkan estetika dengan logika fidelitas tinggi." },
        s2: { title: "Rekayasa Aplikasi", desc: "Sistem berperforma tinggi dan terukur yang dibangun dengan arsitektur tangguh." },
        s3: { title: "Neural UI", desc: "Lapisan interaksi cerdas yang memberikan konektivitas mulus di semua titik akhir." },
        s4: { title: "Recon Strategis", desc: "Optimalisasi kehadiran digital melalui analisis performa berbasis data." },
      }
    },
    chat: {
      header: "Aether AI",
      neural: "Antarmuka Inteligensi Strategis",
      active: "Tautan Jaringan Aktif",
      unleash: "REKAYASA",
      pulse: "VISI ANDA",
      description: "Saya adalah lapisan inteligensi strategis Anda, yang dirancang untuk logika disruptif dan presisi kreatif.",
      placeholder: "Mulai sesi konsultasi...",
      suggestions: [
        "Siapa arsitek utamanya?",
        "Berikan strategi disruptif untuk fintech.",
        "Detail metodologi presisi Aether.",
        "Arsitektur konsep untuk lab visual AI."
      ],
      error: "Tautan komunikasi tidak stabil. Silakan inisialisasi ulang terminal."
    }
  }
};
