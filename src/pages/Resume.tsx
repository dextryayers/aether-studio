import { PageLayout } from "@/src/components/layout/PageLayout"
import { SEO } from "@/src/components/layout/SEO"
import { useLanguage } from "@/src/context/LanguageContext"
import { motion } from "motion/react"
import { 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  Linkedin, 
  Github, 
  Award, 
  GraduationCap, 
  Briefcase, 
  Code, 
  Zap, 
  Cpu, 
  CheckCircle2, 
  Target,
  Download
} from "lucide-react"
import { Button } from "@/src/components/ui/button"

export default function Resume() {
  const { t, language } = useLanguage()

  const resumeData = {
    name: "HANIF ABDURROHIM",
    title: "BUG HUNTER | WEB DEV",
    contact: {
      phone: "+62 823-3243-0578",
      email: "ytaniipid@gmail.com",
      location: "Surabaya, Indonesia",
      website: "www.haniipp.space",
      linkedin: "https://linkedin.com/in/hanifabdurrohim",
      github: "https://github.com/dextryayers",
      instagram: "https://instagram.com/hanziip.kds"
    },
    profile: {
      id: "Siswa SMK jurusan Teknik Jaringan Komputer dan Telekomunikasi dengan ketertarikan mendalam pada keamanan siber, pengembangan web, serta troubleshooting sistem dan jaringan. Terbiasa mengeksplorasi kerentanan aplikasi dan membangun antarmuka web yang responsif. Memiliki pola pikir problem solver yang terlatih, mampu bekerja secara mandiri maupun tim, serta cepat menyesuaikan diri dengan perkembangan teknologi terbaru.",
      en: "Computer and Network Engineering student with a deep interest in cybersecurity, web development, and network troubleshooting. Experienced in vulnerability research and building responsive web interfaces. A trained problem solver capable of working independently or in teams, with the ability to quickly adapt to the latest technological advancements."
    },
    education: [
      {
        year: "2023 - 2026",
        level: "SMK",
        school: "SMK Muhammadiyah 1 Surabaya",
        major: "Teknik Komputer Jaringan"
      },
      {
        year: "2020 - 2023",
        level: "SMP",
        school: "MTsT Al - Atsary Kediri",
        major: ""
      }
    ],
    experience: [
      {
        title: "Bug Hunter ( Freelance )",
        company: "HackerOne Inc. | 2023 - 2025",
        tasks: {
          id: [
            "Melakukan penetration testing manual menggunakan Burp Suite dan OWASP ZAP pada aplikasi web dan API",
            "Menyusun laporan kerentanan secara terstruktur dan jelas, mencakup langkah reproduksi, dampak risiko, serta rekomendasi perbaikan teknis yang dapat langsung diimplementasikan oleh tim pengembang."
          ],
          en: [
            "Performed manual penetration testing using Burp Suite and OWASP ZAP on web applications and APIs.",
            "Prepared structured and clear vulnerability reports, including reproduction steps, risk impact, and technical remediation recommendations."
          ]
        }
      },
      {
        title: "Fullstack Web Developer dan Data Administrasi ( Internship )",
        company: "Dinas Kesehatan Prov. Jawa Timur | Sep 2025 - Des 2025",
        tasks: {
          id: [
            "Mengembangkan sistem peminjaman buku berbasis Google Form, Google Spreadsheet, dan Google Apps Script",
            "Melakukan entri, rekapitulasi, dan pengolahan data laporan keuangan serta data penyebaran penyakit menggunakan Microsoft Excel dan Google Spreadsheet",
            "Berkontribusi dalam pengembangan dan pemeliharaan sistem informasi \"Web Pelayanan Rumah Sakit\", sebuah platform internal untuk mengelola data rujukan pasien antar fasilitas kesehatan di wilayah Jawa Timur"
          ],
          en: [
            "Developed a book lending system based on Google Forms, Google Sheets, and Google Apps Script.",
            "Performed data entry, recapitulation, and processing of financial reports and disease spread data using Microsoft Excel and Google Sheets.",
            "Contributed to the development and maintenance of the \"Hospital Service Web\" information system, an internal platform for managing patient referrals between healthcare facilities in East Java."
          ]
        }
      }
    ],
    skills: {
      id: ["Penetration Testing", "Web Development", "Troubleshooting"],
      en: ["Penetration Testing", "Web Development", "Troubleshooting"]
    },
    certificates: [
      {
        title: "Keamanan Siber",
        desc: {
          id: "Sertifikat Apresiasi Bug Hunter dari Kementerian Kesehatan RI (2025), Pemerintah Kota Bogor (2025), Kabupaten Jombang (2025), dan Kabupaten Mahakam Ulu (2025).",
          en: "Bug Hunter Appreciation Certificate from the Ministry of Health RI (2025), Bogor City Government (2025), Jombang Regency (2025), and Mahakam Ulu Regency (2025)."
        }
      },
      {
        title: "Web Developer",
        desc: {
          id: "Sertifikasi Full Stack Web Development dari Rekamin Academy (2024).",
          en: "Full Stack Web Development Certification from Rekamin Academy (2024)."
        }
      }
    ],
    training: [
      {
        title: { id: "Keamanan Siber | Otodidak & Online Course", en: "Cybersecurity | Self-taught & Online Course" },
        period: "2023 - 2025",
        desc: {
          id: "Mempelajari dasar hingga lanjutan keamanan sistem, termasuk identifikasi kerentanan, analisis serangan, serta praktik dasar penetration testing.",
          en: "Learned basic to advanced system security, including vulnerability identification, attack analysis, and basic penetration testing practices."
        }
      },
      {
        title: { id: "Pengembangan Web | Self Learning", en: "Web Development | Self Learning" },
        period: "2024-2026",
        desc: {
          id: "Mempelajari pengembangan website modern mulai dari front-end hingga back-end dengan fokus pada performa, responsivitas, dan struktur aplikasi.",
          en: "Learned modern website development from front-end to back-end with a focus on performance, responsiveness, and application structure."
        }
      },
      {
        title: { id: "Internet of Things | Online Course", en: "Internet of Things | Online Course" },
        period: "2025-2026",
        desc: {
          id: "Mempelajari konsep dan implementasi perangkat terhubung menggunakan mikrokontroler (seperti Arduino) untuk sistem otomatisasi dan monitoring.",
          en: "Learned concepts and implementation of connected devices using microcontrollers (such as Arduino) for automation and monitoring systems."
        }
      },
      {
        title: { id: "Artificial Intelligence | Dicoding", en: "Artificial Intelligence | Dicoding" },
        period: "2025-2026",
        desc: {
          id: "Mempelajari dasar kecerdasan buatan, termasuk pemrosesan data, penggunaan API AI, serta penerapan AI dalam pengembangan aplikasi sederhana.",
          en: "Learned the basics of artificial intelligence, including data processing, AI API usage, and the application of AI in simple application development."
        }
      }
    ],
    projects: [
      {
        name: "AI Assistant (Python)",
        desc: {
          id: "Mengembangkan asisten AI berbasis Python dengan integrasi API OpenAI dan Gemini untuk otomatisasi tugas dan pemrosesan bahasa alami.",
          en: "Developed a Python-based AI assistant with OpenAI and Gemini API integration for task automation and natural language processing."
        }
      },
      {
        name: "Ethical Hacking Tools – Vulnerability Scanner Framework",
        desc: {
          id: "Membangun framework pemindaian kerentanan untuk mengidentifikasi celah keamanan pada aplikasi web secara terstruktur.",
          en: "Built a vulnerability scanning framework to identify security flaws in web applications in a structured manner."
        }
      },
      {
        name: "Website Portofolio",
        desc: {
          id: "Mengembangkan website portofolio responsif menggunakan Astro, Vue, Tailwind CSS, dan shadcn UI dengan fokus pada performa dan UI/UX.",
          en: "Developed a responsive portfolio website using Astro, Vue, Tailwind CSS, and shadcn UI with a focus on performance and UI/UX."
        }
      },
      {
        name: "Web Pelayanan Rumah Sakit – Dinas Kesehatan Provinsi Jawa Timur",
        desc: {
          id: "Mengembangkan sistem layanan rujukan rumah sakit berbasis web untuk mendukung koordinasi layanan kesehatan di tingkat provinsi.",
          en: "Developed a web-based hospital referral service system to support health service coordination at the provincial level."
        }
      }
    ],
    softSkills: {
      id: ["Problem solving terstruktur", "Ketelitian tinggi", "Adaptif terhadap perubahan", "Komunikasi teknis yang jelas", "Tanggung jawab personal", "Cepat Belajar Hal Baru"],
      en: ["Structured problem solving", "Attention to detail", "Adaptive to change", "Clear technical communication", "Personal responsibility", "Fast Learner"]
    },
    careerGoal: {
      id: "Bercita-cita menjadi profesional yang mampu menjembatani dunia pengembangan web dan keamanan siber. Ke depannya ingin terus belajar membangun aplikasi yang tidak hanya cepat dan fungsional, tetapi juga tangguh menghadapi ancaman digital, serta turut berkontribusi menciptakan ruang internet yang lebih aman bagi banyak orang.",
      en: "Aspiring to become a professional capable of bridging the worlds of web development and cybersecurity. In the future, I aim to continue learning how to build applications that are not only fast and functional but also resilient against digital threats, and contribute to creating a safer internet space for everyone."
    },
    skillStack: [
      {
        category: "Cybersecurity",
        items: "Burp Suite | OWASP ZAP | Nmap | Wireshark | Vulnerability Assesment | Penetration Testing | Nikto | Bug Bounty"
      },
      {
        category: "Web Development",
        items: "Front End : React.js | Vue.js | Astro | Tailwind CSS | Next.js | Back End : Node.js | Nest.js | Express | REST API | Laravel | Database : PostgreSQL | MySQL"
      },
      {
        category: "Tools & Lainnya",
        items: "Git | Linux CLI | Docker | Postman | OpenAI API | Gemini API | Arduino (IOT)"
      },
      {
        category: "Sistem & Troubleshooting",
        items: "Instalasi dan konfigurasi Windows / Linux (Ubuntu, Debian) | Diagnostik jaringan (TCP/IP, DNS, DHCP) | Update sistem & patch keamanan"
      }
    ]
  }

  const isIndo = language === "id"

  return (
    <PageLayout>
      <SEO 
        title={`${resumeData.name} | ${resumeData.title}`}
        description={isIndo ? resumeData.profile.id : resumeData.profile.en}
        path="/resume"
      />
         <div className="bg-background min-h-screen text-foreground selection:bg-primary selection:text-primary-foreground pb-20">
        <div className="max-w-5xl mx-auto shadow-none bg-background min-h-screen overflow-hidden border-x border-border">
          
          {/* Top Header Section */}
          <div className="flex flex-col md:flex-row bg-background border-b border-border">
            {/* Profile Photo Area */}
            <div className="w-full md:w-1/3 bg-background flex flex-col items-center justify-center p-12 relative overflow-hidden min-h-[300px] border-r border-border">
              <div className="relative z-10 flex flex-col items-center gap-8">
                <div className="w-48 h-48 rounded-none border border-border shadow-none overflow-hidden bg-muted">
                  <img 
                    src="/CV.jpg" 
                    alt={resumeData.name} 
                    className="w-full h-full object-cover grayscale transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <Button asChild className="rounded-none bg-primary hover:bg-muted text-primary-foreground font-black uppercase tracking-[0.2em] text-[10px] px-8 py-6 h-auto group transition-all border border-border">
                  <a href="/CV_Hanif.pdf" download="CV_Hanif.pdf">
                    <Download className="mr-3 h-4 w-4 group-hover:-translate-y-1 transition-transform" />
                    {isIndo ? "UNDUH CV" : "DOWNLOAD CV"}
                  </a>
                </Button>
              </div>
            </div>

            {/* Name and Contact Area */}
            <div className="w-full md:w-2/3 p-12 flex flex-col justify-center items-center text-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground uppercase">{resumeData.name}</h1>
                <p className="text-xl font-medium tracking-[0.4em] text-primary italic">{resumeData.title}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12 pt-4">
                <div className="flex flex-col items-center gap-3 group">
                   <div className="w-10 h-10 border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <Phone className="h-4 w-4" />
                   </div>
                   <span className="text-xs font-bold uppercase tracking-widest">{resumeData.contact.phone}</span>
                </div>
                <div className="flex flex-col items-center gap-3 group">
                   <div className="w-10 h-10 border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <Mail className="h-4 w-4" />
                   </div>
                   <span className="text-xs font-bold uppercase tracking-widest">{resumeData.contact.email}</span>
                </div>
                <div className="flex flex-col items-center gap-3 group">
                   <div className="w-10 h-10 border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <MapPin className="h-4 w-4" />
                   </div>
                   <span className="text-xs font-bold uppercase tracking-widest">{resumeData.contact.location}</span>
                </div>
                <div className="flex flex-col items-center gap-3 group">
                   <div className="w-10 h-10 border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <Globe className="h-4 w-4" />
                   </div>
                   <span className="text-xs font-bold uppercase tracking-widest">{resumeData.contact.website}</span>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="flex items-center justify-center gap-6 pt-8 border-t border-border/30">
                <a href={resumeData.contact.linkedin} target="_blank" rel="noopener noreferrer" className="group">
                  <div className="w-10 h-10 border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <Linkedin className="h-4 w-4" />
                  </div>
                </a>
                <a href={resumeData.contact.github} target="_blank" rel="noopener noreferrer" className="group">
                  <div className="w-10 h-10 border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <Github className="h-4 w-4" />
                  </div>
                </a>
                <a href={resumeData.contact.instagram} target="_blank" rel="noopener noreferrer" className="group">
                  <div className="w-10 h-10 border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4c0 3.2-2.6 5.8-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8C2 4.6 4.6 2 7.8 2m-.5 2c-2 0-3.3 1.3-3.3 3.3v8.8c0 2 1.3 3.3 3.3 3.3h9.4c2 0 3.3-1.3 3.3-3.3V7.3c0-2-1.3-3.3-3.3-3.3H7.3m9.6 1.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3m-5.1 1.4c2.7 0 4.9 2.2 4.9 4.9s-2.2 4.9-4.9 4.9-4.9-2.2-4.9-4.9 2.2-4.9 4.9-4.9m0 2c-1.5 0-2.7 1.2-2.7 2.7s1.2 2.7 2.7 2.7 2.7-1.2 2.7-2.7-1.2-2.7-2.7-2.7z"/></svg>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Sidebar Column */}
            <div className="lg:col-span-4 bg-background border-r border-border p-12 space-y-16 flex flex-col items-center text-center">
              
              {/* Pendidikan */}
              <section className="space-y-8 w-full">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-2 border border-border text-primary">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-black tracking-[0.4em] uppercase">{isIndo ? "PENDIDIKAN" : "EDUCATION"}</h2>
                </div>
                <div className="space-y-8">
                  {resumeData.education.map((edu, i) => (
                    <div key={i} className="space-y-1">
                      <p className="text-xs font-black text-primary italic">{edu.year}</p>
                      <p className="text-[10px] font-bold uppercase opacity-50 mb-1">{edu.level}</p>
                      <p className="text-sm font-bold leading-tight uppercase">{edu.school}</p>
                      {edu.major && <p className="text-[10px] uppercase opacity-60 mt-1">{edu.major}</p>}
                    </div>
                  ))}
                </div>
              </section>

              {/* Keahlian */}
              <section className="space-y-8 w-full">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-2 border border-border text-primary">
                    <Target className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-black tracking-[0.4em] uppercase">{isIndo ? "KEAHLIAN" : "EXPERT SKILLS"}</h2>
                </div>
                <div className="flex flex-col items-center gap-2">
                  {(isIndo ? resumeData.skills.id : resumeData.skills.en).map((skill, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-2 border border-border w-full max-w-[200px] justify-center text-[10px] font-black uppercase tracking-widest">
                      {skill}
                    </div>
                  ))}
                </div>
              </section>

              {/* Sertifikat */}
              <section className="space-y-8 w-full">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-2 border border-border text-primary">
                    <Award className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-black tracking-[0.4em] uppercase">{isIndo ? "SERTIFIKAT" : "CERTIFICATES"}</h2>
                </div>
                <div className="space-y-8">
                  {resumeData.certificates.map((cert, i) => (
                    <div key={i} className="space-y-3">
                      <p className="text-xs font-black text-foreground uppercase border-b border-border pb-2 inline-block">{cert.title}</p>
                      <p className="text-[10px] text-muted-foreground leading-relaxed font-medium italic opacity-80">
                        {isIndo ? cert.desc.id : cert.desc.en}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Digital Badges */}
              <section className="space-y-8 w-full">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-2 border border-border text-primary">
                    <Zap className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-black tracking-[0.4em] uppercase">{isIndo ? "BADGE DIGITAL" : "DIGITAL BADGES"}</h2>
                </div>
                <div className="flex justify-center gap-4 px-4">
                  <div className="group relative">
                    <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 opacity-0 group-hover:opacity-100" />
                    <img 
                      src="/badge1.png" 
                      alt="Cisco Badge 1" 
                      className="w-20 h-20 relative z-10 border border-border p-2 grayscale group-hover:grayscale-0 transition-all duration-500 bg-background"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="group relative">
                    <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 opacity-0 group-hover:opacity-100" />
                    <img 
                      src="/badge2.png" 
                      alt="Cisco Badge 2" 
                      className="w-20 h-20 relative z-10 border border-border p-2 grayscale group-hover:grayscale-0 transition-all duration-500 bg-background"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
                <p className="text-[9px] font-black tracking-widest text-primary opacity-40 uppercase">Verified via Cisco Academy</p>
              </section>

              {/* Pelatihan */}
              <section className="space-y-8 w-full">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-2 border border-border text-primary">
                    <Cpu className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-black tracking-[0.4em] uppercase">{isIndo ? "PELATIHAN" : "TRAINING"}</h2>
                </div>
                <div className="space-y-8">
                  {resumeData.training.map((t, i) => (
                    <div key={i} className="space-y-2">
                      <p className="text-xs font-black text-foreground uppercase">
                        {isIndo ? t.title.id : t.title.en}
                      </p>
                      <p className="text-[9px] font-black tracking-[0.3em] text-primary uppercase italic">{t.period}</p>
                      <p className="text-[10px] text-muted-foreground leading-relaxed font-medium italic opacity-80">
                        {isIndo ? t.desc.id : t.desc.en}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Main Column */}
            <div className="lg:col-span-8 p-12 space-y-16 items-center text-center">
              
              {/* Info Profil */}
              <section className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="h-px grow bg-border" />
                  <h2 className="text-lg font-black tracking-[0.4em] uppercase text-foreground">{isIndo ? "INFO PROFIL" : "PROFILE INFO"}</h2>
                  <div className="h-px grow bg-border" />
                </div>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-medium mx-auto max-w-2xl italic">
                  {isIndo ? resumeData.profile.id : resumeData.profile.en}
                </p>
              </section>

              {/* Pengalaman Kerja */}
              <section className="space-y-12">
                <div className="flex items-center gap-6">
                  <div className="h-px grow bg-border" />
                  <h2 className="text-lg font-black tracking-[0.4em] uppercase text-foreground">{isIndo ? "PENGALAMAN KERJA" : "WORK EXPERIENCE"}</h2>
                  <div className="h-px grow bg-border" />
                </div>
                <div className="space-y-16">
                  {resumeData.experience.map((exp, i) => (
                     <div key={i} className="space-y-6">
                        <div className="space-y-2">
                          <h3 className="text-2xl md:text-4xl font-black tracking-tight text-foreground uppercase underline decoration-1 underline-offset-8">{exp.title}</h3>
                          <p className="text-xs font-bold text-primary tracking-[0.3em] uppercase italic">{exp.company}</p>
                        </div>
                        <ul className="space-y-4 flex flex-col items-center">
                          {(isIndo ? exp.tasks.id : exp.tasks.en).map((task, j) => (
                            <li key={j} className="flex flex-col items-center max-w-2xl px-4">
                               <span className="text-sm text-muted-foreground leading-relaxed italic">{task}</span>
                            </li>
                          ))}
                        </ul>
                     </div>
                  ))}
                </div>
              </section>

              {/* Technical Stack */}
              <section className="space-y-12">
                <div className="flex items-center gap-6">
                  <div className="h-px grow bg-border" />
                  <h2 className="text-lg font-black tracking-[0.4em] uppercase text-foreground">{isIndo ? "TECHNICAL STACK" : "TECHNICAL STACK"}</h2>
                  <div className="h-px grow bg-border" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {resumeData.skillStack.map((stack, i) => (
                    <div key={i} className="space-y-4 flex flex-col items-center p-6 border border-border">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">{stack.category}</h4>
                      <p className="text-[10px] text-muted-foreground leading-relaxed font-bold uppercase tracking-widest text-center">
                        {stack.items}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

            </div>
          </div>

          <div className="bg-primary text-primary-foreground p-12 text-center space-y-6">
            <p className="text-[10px] font-black tracking-[0.8em] uppercase opacity-40">
              AETHER STUDIO ARCHIVE v3.0
            </p>
            <div className="flex justify-center gap-12 text-[10px] font-black uppercase tracking-widest">
               <span>SURABAYA // ID</span>
               <span>{new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
