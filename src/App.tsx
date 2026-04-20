/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { LanguageProvider } from "./context/LanguageContext";
import ScrollToTop from "./components/layout/ScrollToTop";

// Pages
import Home from "./pages/Home";
import Work from "./pages/Work";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Chat from "./pages/Chat";
import Resume from "./pages/Resume";
import Lab from "./pages/Lab";

// Lab Tools
import MdPreview from "./pages/lab/MdPreview";
import CssPalette from "./pages/lab/CssPalette";
import CssPlaying from "./pages/lab/CssPlaying";
import CssPlayingGame from "./pages/lab/CssPlayingGame";

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LanguageProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/work" element={<Work />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/resume" element={<Resume />} />
            
            {/* Lab Sector */}
            <Route path="/lab" element={<Lab />} />
            <Route path="/lab/md-prev" element={<MdPreview />} />
            <Route path="/lab/css-palette" element={<CssPalette />} />
            <Route path="/lab/css-playing" element={<CssPlaying />} />
            <Route path="/lab/css-playing/:level/play" element={<CssPlayingGame />} />
          </Routes>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}
