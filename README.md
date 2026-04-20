# AETHER STUDIO — Digital Presence Platform

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg?style=for-the-badge)

**A sophisticated, modern portfolio and services platform engineered by Hanif Abdurrohim**

[🌐 Live Demo](#) • [📚 Documentation](#architecture) • [🚀 Quick Start](#quick-start)

</div>

---

## 🎯 Overview

AETHER STUDIO is a **cutting-edge digital presence platform** that seamlessly combines frontend excellence with advanced AI capabilities. Built for web developers, cybersecurity professionals, and digital innovators, it serves as both a professional portfolio and interactive showcase of expertise.

The platform demonstrates:
- **Enterprise-grade React architecture** with TypeScript
- **Real-time AI conversational interface** powered by Google Gemini
- **Responsive, accessible UI** built with Tailwind CSS & shadcn/ui
- **Dynamic content management** with multi-language support
- **Optimized performance** through Vite's fast build system

---

## ✨ Key Features

### 🎨 Design & UX Excellence
- **Immersive Dark/Light Theme System** with seamless transitions
- **Responsive Design** that works flawlessly on all devices (mobile, tablet, desktop)
- **Smooth Animations & Transitions** using Framer Motion for professional interactions
- **Accessible Components** built with ARIA compliance and Radix UI primitives
- **Typography Enhancement** with Tailwind CSS Typography for rich content display

### 🤖 AI-Powered Features
- **AETHER AI Assistant** — An intelligent chatbot with sophisticated natural language understanding
- **Streaming Response Technology** for real-time AI interactions
- **Context-Aware Conversations** with system instructions for strategic responses
- **Gemini 3 Flash Model** integration for high-performance, cost-effective AI
- **Error Handling & Fallbacks** for robust AI service reliability

### 💼 Professional Capabilities
- **Dynamic Portfolio Display** showcasing projects and work experience
- **Resume & CV Integration** with downloadable PDF option
- **Contact Management System** with location-based maps (Google Maps embed)
- **Services Showcase** with detailed service descriptions and expertise areas
- **Lab & Playground** for technical demonstrations and experiments

### 🌍 Multi-Language Support
- **Internationalization (i18n)** with language context management
- **Indonesian & English** language support
- **Dynamic content switching** without page reload
- **Localized routing** and SEO metadata

### 🔗 Social Media Integration
- **Direct social media links** (LinkedIn, GitHub, Instagram)
- **Contact information** accessible across all pages
- **Phone number** (+62 823-3243-0578) integrated in contact sections
- **Professional presence** with consistent branding

---

## 🛠 Technology Stack

### **Frontend Framework**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 19.0.0 | Modern UI library with hooks and concurrent features |
| **TypeScript** | Latest | Type-safe JavaScript for robust development |
| **Vite** | 6.2.0 | Lightning-fast build tool and development server |
| **React Router DOM** | 7.14.1 | Client-side routing with advanced navigation patterns |

### **Styling & UI Components**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Tailwind CSS** | 4.1.14 | Utility-first CSS framework for rapid UI development |
| **Tailwind Typography** | 0.5.19 | Professional typography plugin for rich text content |
| **Tailwind CSS Vite** | 4.1.14 | Vite integration for optimized Tailwind processing |
| **shadcn/ui** | Latest | Premium React component library built on Radix UI |
| **Lucide React** | 0.546.0 | Beautiful, consistent icon library (500+ icons) |

### **Animation & Motion**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Framer Motion** | 12.23.24 | Advanced animation library for React |
| **Motion** | 12.23.24 | Lightweight animation primitive |

### **UI Primitives (Radix UI)**
| Component | Version | Purpose |
|-----------|---------|---------|
| Dialog | 1.1.15 | Accessible modal/dialog components |
| Dropdown Menu | 2.1.16 | Accessible dropdown menu system |
| Navigation Menu | 1.2.14 | Accessible navigation menu patterns |
| Tabs | 1.1.13 | Accessible tab components |
| Separator | 1.1.8 | Visual divider components |
| Label | 2.1.8 | Accessible form labels |
| Slot | 1.2.4 | Flexible component composition |

### **AI & LLM Integration**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Google Generative AI** | 1.29.0 | Google Gemini API integration |
| **Gemini 3 Flash** | - | Fast, efficient language model for real-time responses |

### **Content & Markdown**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React Markdown** | 10.1.0 | Markdown to React component parsing |
| **Remark GFM** | 4.0.1 | GitHub Flavored Markdown support |
| **Rehype Raw** | 7.0.0 | Parse raw HTML within markdown |
| **Rehype Highlight** | 7.0.2 | Syntax highlighting for code blocks |

### **Utilities & Helpers**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **class-variance-authority** | 0.7.1 | Type-safe styling variations |
| **Tailwind Merge** | 3.5.0 | Intelligent Tailwind CSS class merging |
| **clsx** | 2.1.1 | Conditional className management |
| **Stylis** | 4.4.0 | CSS-in-JS preprocessor |

### **SEO & Meta Management**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React Helmet Async** | 3.0.0 | Manage document head for SEO |
| **Custom SEO Component** | - | Dynamic meta tag injection |

### **Theme Management**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **next-themes** | 0.4.6 | Elegant theme provider system |
| **Theme Context** | - | React context for global theme state |

### **Development Tools**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **@vitejs/plugin-react** | 5.0.4 | React Fast Refresh for hot module replacement |
| **TypeScript** | 5.0+ | Static type checking |
| **Autoprefixer** | 10.4.21 | CSS vendor prefix automation |
| **dotenv** | 17.2.3 | Environment variable management |

### **Backend Support**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Express** | 4.21.2 | Optional server runtime (can be used for API endpoints) |

---

## 📁 Project Structure

```
hanif-abdurrohim---aether-studio
│
├── src/
│   ├── pages/                          # Page components
│   │   ├── Home.tsx                    # Landing/home page
│   │   ├── About.tsx                   # About/bio page
│   │   ├── Contact.tsx                 # Contact form & information
│   │   ├── Work.tsx                    # Portfolio/projects showcase
│   │   ├── Services.tsx                # Services offering
│   │   ├── Resume.tsx                  # CV/Resume display
│   │   ├── Chat.tsx                    # AI chat interface
│   │   ├── Lab.tsx                     # Tech lab/playground
│   │   └── lab/                        # Lab sub-components
│   │       ├── CssPalette.tsx          # CSS color palette tool
│   │       ├── CssPlaying.tsx          # CSS demo
│   │       ├── CssPlayingGame.tsx      # Interactive CSS game
│   │       └── MdPreview.tsx           # Markdown preview
│   │
│   ├── components/
│   │   ├── layout/                     # Layout wrappers
│   │   │   ├── PageLayout.tsx          # Main page layout wrapper
│   │   │   ├── Navbar.tsx              # Navigation bar
│   │   │   ├── Footer.tsx              # Footer with social links
│   │   │   ├── AIChat.tsx              # AI chat widget
│   │   │   ├── CookieConsent.tsx       # Cookie consent banner
│   │   │   ├── ModeToggle.tsx          # Theme toggle button
│   │   │   ├── ScrollToTop.tsx         # Scroll-to-top button
│   │   │   ├── SEO.tsx                 # SEO/meta tag injector
│   │   │   └── TechnicalOverlay.tsx    # Technical info overlay
│   │   │
│   │   ├── sections/                   # Page sections
│   │   │   ├── Hero.tsx                # Hero banner
│   │   │   ├── ProjectCard.tsx         # Individual project card
│   │   │   ├── ProjectsGrid.tsx        # Grid of projects
│   │   │   └── ServicesSection.tsx     # Services showcase
│   │   │
│   │   ├── ui/                         # Reusable UI components
│   │   │   ├── button.tsx              # Button variants
│   │   │   ├── input.tsx               # Form input
│   │   │   ├── textarea.tsx            # Text area form
│   │   │   ├── card.tsx                # Card container
│   │   │   ├── badge.tsx               # Badge labels
│   │   │   ├── separator.tsx           # Visual divider
│   │   │   ├── dropdown-menu.tsx       # Dropdown menu
│   │   │   ├── sheet.tsx               # Slide-out panel
│   │   │   ├── navigation-menu.tsx     # Navigation menu
│   │   │   └── LanyardBadge.tsx        # Discord Lanyard integration
│   │   │
│   │   ├── ThemeProvider.tsx           # Theme context provider
│   │
│   ├── context/
│   │   └── LanguageContext.tsx         # Multi-language context
│   │
│   ├── hooks/
│   │   └── use-reveal.ts               # Scroll reveal animation hook
│   │
│   ├── services/
│   │   └── geminiService.ts            # Google Gemini AI service
│   │
│   ├── lib/
│   │   └── utils.ts                    # Utility functions
│   │
│   ├── App.tsx                         # Main app component
│   ├── main.tsx                        # React DOM entry point
│   └── index.css                       # Global styles
│
├── public/
│   ├── robots.txt                      # SEO robots configuration
│   ├── sitemap.xml                     # SEO sitemap
│   └── [assets]                        # Static images, icons, etc.
│
├── index.html                          # HTML entry point
├── package.json                        # Dependencies & scripts
├── tsconfig.json                       # TypeScript configuration
├── vite.config.ts                      # Vite build configuration
├── tailwind.config.js                  # Tailwind CSS configuration
├── .env                                # Environment variables
└── README.md                           # This file
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- Google Gemini API key (for AI features)

### Installation

```bash
# Clone the repository
git clone https://github.com/dextryayers/aether-studio.git
cd aether-studio

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Add your Gemini API key to .env
# GEMINI_API_KEY=your_api_key_here
```

### Development Server

```bash
# Start development server (port 3000)
npm run dev

# Open browser to http://localhost:3000
```

### Build for Production

```bash
# Build optimization
npm run build

# Preview production build
npm run preview

# Clean build artifacts
npm run clean
```

### Linting

```bash
# Type check
npm run lint
```

---

## 🏗 Architecture & Design Patterns

### **Component Architecture**
The project follows a **modular, hierarchical component structure**:

```
PageLayout (Wrapper)
  ├── Navbar
  ├── Main Content (Page Component)
  │   ├── Hero Section
  │   ├── Content Sections
  │   └── CTAs
  ├── Footer
  └── AIChat (Floating Widget)
```

### **State Management**
- **React Context API** for global state (language, theme)
- **Component-level hooks** for local state management
- **No external state library** for simplicity and performance

### **Routing**
- **Client-side routing** with React Router v7
- **Lazy loading** of page components for better performance
- **Dynamic route parameters** for flexible navigation

### **Styling Approach**
1. **Tailwind CSS** for utility-first styling
2. **CSS Variables** for theme-based color schemes
3. **Class Variance Authority** for component variants
4. **Responsive Design** with mobile-first approach

### **AI Integration Pattern**
```
User Input → AIChat Component → Gemini Service → Stream Handler → UI Update
```

---

## 🎨 UI Component Library

### Built-in Components

#### **shadcn/ui Components**
- Highly customizable, copy-paste component library
- Built on Radix UI primitives (accessibility-first)
- Uses Tailwind CSS for styling

#### **Custom Components**
- **ProjectCard** — Displays individual project with tech stack
- **Hero** — Large, attention-grabbing banner section
- **ServicesSection** — Showcase of professional services
- **AIChat** — Real-time conversational AI interface
- **SEO** — Dynamic meta tag management

#### **Icon Library**
- **Lucide React** (500+ icons) for consistent iconography
- **Instagram SVG** custom icon for social media

---

## 🤖 AI Integration

### Gemini Service Architecture

**File:** `src/services/geminiService.ts`

```typescript
// System Instruction (AI Personality)
- Strategic Sophistication
- Comprehensive Depth
- Engaging Narrative
- Intellectual Rigor
```

**Configuration:**
- **Model:** Gemini 3 Flash (optimized for speed)
- **Temperature:** 0.8 (creative responses)
- **Max Tokens:** 2000 (detailed answers)
- **TopP:** 0.85 (diversity)

**Features:**
- Streaming responses for real-time feedback
- Error handling with fallback messages
- Context-aware conversations
- Multi-turn chat support

### AETHER AI Personality
The AI is configured to be:
- **Strategically sophisticated** in digital landscape insights
- **Professionally authoritative** yet visionary
- **Detail-oriented** with comprehensive explanations
- **Engaging** with real-world examples
- **Knowledgeable** about web dev, cybersecurity, branding, UI/UX

---

## 🌍 Multi-Language Support

### Language Context System

**File:** `src/context/LanguageContext.tsx`

**Supported Languages:**
- 🇮🇩 Indonesian (id)
- 🇬🇧 English (en)

**Usage:**
```tsx
const { t, language, setLanguage } = useLanguage()

// Access translations
<h1>{t("home.title")}</h1>

// Switch language
<button onClick={() => setLanguage('en')}>English</button>
```

**Translation Keys Structure:**
- `seo.*` — SEO metadata
- `nav.*` — Navigation
- `contact.*` — Contact page
- `home.*` — Home page
- `about.*` — About page
- etc.

---

## 🎯 Key Pages & Features

### 🏠 **Home (`/`)**
- Landing page with hero section
- Technology stack showcase
- Featured projects preview
- CTA for services/contact

### 👤 **About (`/about`)**
- Professional biography
- Career journey narrative
- Key accomplishments
- Professional philosophy

### 💼 **Resume (`/resume`)**
- Full CV display
- Education history
- Work experience
- Skills & certifications
- Training & development
- Professional achievements
- **Social media links with logos**

### 📧 **Contact (`/contact`)**
- Contact form (name, email, message)
- Service selection options
- Location information with Google Maps
- **Social media section** with clickable logos
- Operating hours & availability

### 🛠 **Services (`/services`)**
- Service offerings breakdown
- Expertise areas
- Project capability showcase
- Pricing/availability info

### 💼 **Work/Portfolio (`/work`)**
- Project showcase grid
- Project cards with descriptions
- Technology stacks used
- Links to live demos/GitHub

### 🤖 **Chat (`/chat`)**
- Dedicated AI chat interface
- Conversation history
- Streaming response display
- Professional AI assistant

### 🧪 **Lab (`/lab`)**
- CSS Palette Tool
- CSS Playing Demos
- CSS Interactive Game
- Markdown Preview Tool

---

## 🎨 Theming System

### Theme Features
- **Dark mode & Light mode** with smooth transitions
- **System preference detection**
- **Persistent theme preference** (localStorage)
- **Global CSS variables** for colors

### Theme Configuration
Managed by `next-themes` with custom ThemeProvider component

```tsx
<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  <App />
</ThemeProvider>
```

### CSS Variables
- `--background` / `--foreground`
- `--primary` / `--primary-foreground`
- `--muted` / `--muted-foreground`
- `--border` / `--card`
- And more...

---

## 📱 Responsive Design

### Breakpoints (Tailwind CSS)
- **sm:** 640px — Small devices
- **md:** 768px — Tablets
- **lg:** 1024px — Desktops
- **xl:** 1280px — Large desktops

### Mobile-First Approach
- Base styles for mobile
- Progressive enhancement with `md:`, `lg:` utilities
- Touch-friendly component sizes
- Optimized performance

---

## ⚡ Performance Optimizations

1. **Vite** — Instant HMR, optimized bundling
2. **Code Splitting** — Route-based lazy loading
3. **CSS Purging** — Only used styles in production
4. **Image Optimization** — Proper sizing and formats
5. **Streaming Responses** — AI responses stream to user
6. **Tree Shaking** — Unused code elimination

---

## 🔐 Environment Variables

Create `.env` file:

```env
# Google Gemini API
GEMINI_API_KEY=your_api_key_here

# Social Media Links
VITE_LINKEDIN_URL=https://linkedin.com/in/YOURPROFILE
VITE_GITHUB_URL=https://github.com/dextryayers
VITE_INSTAGRAM_URL=https://instagram.com/hanziip.kds
VITE_PHONE_NUMBER=082332430578

# Optional: API endpoints
VITE_API_URL=http://localhost:3000
```

---

## 🧪 Testing & Quality

### TypeScript Checking
```bash
npm run lint
```

### Code Quality
- Type-safe with TypeScript
- ESLint integration (optional)
- Prettier formatting (optional)

---

## 📚 Development Workflow

### Adding a New Page
1. Create component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add translations in language context
4. Add navigation link in `Navbar.tsx`

### Adding a New Component
1. Create in appropriate directory (`src/components/`)
2. Use TypeScript for type safety
3. Implement accessibility features
4. Document with JSDoc comments

### Styling Guidelines
- Use Tailwind utilities first
- Create components for repeated patterns
- Use `class-variance-authority` for variants
- Keep specificity low

---

## 🚀 Deployment

### Build Process
```bash
npm run build
# Creates optimized dist/ folder
```

### Deployment Options
- **Vercel** — Recommended for Next.js, works with Vite
- **Netlify** — Simple static hosting
- **AWS S3 + CloudFront** — CDN-backed static hosting
- **GitHub Pages** — Free hosting with custom domain
- **Railway** — Full-stack deployment

### Pre-deployment Checklist
- [ ] Environment variables configured
- [ ] Build successful (`npm run build`)
- [ ] Type checking passes (`npm run lint`)
- [ ] SEO meta tags in place
- [ ] Robots.txt and sitemap.xml updated
- [ ] Images optimized
- [ ] Links tested
- [ ] Mobile responsive verified

---

## 🔗 Social & Contact Integration

### Social Media Links
- **LinkedIn:** linkedin.com/in/hanifabdurrohim
- **GitHub:** github.com/dextryayers
- **Instagram:** instagram.com/hanziip.kds
- **Phone:** +62 823-3243-0578

### Integration Points
- Footer social icons (clickable)
- Resume page social links section
- Contact page social media section

---

## 🎓 Best Practices Implemented

### Code Organization
✅ Component separation of concerns  
✅ Type-safe with TypeScript  
✅ Modular folder structure  
✅ Consistent naming conventions  

### Performance
✅ Code splitting with React Router  
✅ Vite for ultra-fast builds  
✅ Tailwind CSS purging  
✅ Image optimization  
✅ Streaming AI responses  

### Accessibility
✅ Semantic HTML  
✅ ARIA labels & roles  
✅ Keyboard navigation  
✅ Color contrast compliance  
✅ Radix UI primitives  

### SEO
✅ Dynamic meta tags with React Helmet  
✅ Semantic page structure  
✅ Open Graph tags  
✅ Sitemap & robots.txt  
✅ Readable URLs  

---

## 📖 Resources & Documentation

- **React Docs:** https://react.dev
- **TypeScript:** https://www.typescriptlang.org
- **Tailwind CSS:** https://tailwindcss.com
- **Vite:** https://vitejs.dev
- **Radix UI:** https://www.radix-ui.com
- **Framer Motion:** https://www.framer.com/motion
- **Google Gemini:** https://ai.google.dev
- **React Router:** https://reactrouter.com

---

## 🤝 Contributing

This is a personal portfolio project, but if you find bugs or have suggestions:
1. Report issues clearly
2. Provide screenshots/examples
3. Suggest improvements with context

---

## 📝 License

This project is licensed under the **MIT License** — feel free to use this as inspiration for your own projects!

---

## 👨‍💻 About the Developer

**Hanif Abdurrohim**

- **Specializations:** Bug Hunter 🔍 | Web Developer 💻 | Cybersecurity Enthusiast 🛡️
- **Location:** Surabaya, Indonesia 🇮🇩
- **Phone:** +62 823-3243-0578
- **Email:** ytaniipid@gmail.com
- **Website:** www.haniipp.space

**Professional Journey:**
- SMK Muhammadiyah 1 Surabaya (Teknik Komputer Jaringan)
- Bug Bounty Hunter on HackerOne (2023-2025)
- Full Stack Web Developer at Dinas Kesehatan Jawa Timur
- Specialized in penetration testing, vulnerability assessment, and modern web development

**Expertise Areas:**
- Penetration Testing & Vulnerability Assessment
- Full Stack Web Development (Frontend & Backend)
- Cybersecurity & Network Troubleshooting
- UI/UX Design & Digital Strategy
- AI Integration & LLM Applications

---

## 🙏 Acknowledgments

Built with inspiration from modern web development best practices and a passion for creating exceptional digital experiences.

**Technologies that power AETHER:**
- The React community for excellent tools
- Vercel for Vite and frontend excellence
- Radix UI for accessible primitives
- Tailwind CSS for utility-first styling
- Google Gemini for AI capabilities

---

<div align="center">

### Made with ❤️ by Hanif Abdurrohim

**AETHER STUDIO** — *Where Vision Meets Innovation*

[🌐 Portfolio](https://www.haniipp.space) • [💼 LinkedIn](https://linkedin.com/in/hanifabdurrohim) • [🐙 GitHub](https://github.com/dextryayers) • [📸 Instagram](https://instagram.com/hanziip.kds)

</div>

