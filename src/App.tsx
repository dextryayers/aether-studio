/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { LanguageProvider } from "./context/LanguageContext";
import { AdminProvider } from "./context/AdminContext";
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
import SubdomainFinder from "./pages/lab/SubdomainFinder";
import DnsFinder from "./pages/lab/DnsFinder";
import CryptoTool from "./pages/lab/CryptoTool";

// Admin
import AdminLogin from "./pages/admin/Login";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import ProjectsManager from "./pages/admin/ProjectsManager";
import ServicesManager from "./pages/admin/ServicesManager";
import TimelineManager from "./pages/admin/TimelineManager";
import AboutManager from "./pages/admin/AboutManager";
import ContactManager from "./pages/admin/ContactManager";
import MessagesManager from "./pages/admin/MessagesManager";

import { LoadingScreen } from "./components/LoadingScreen"

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LanguageProvider>
        <LoadingScreen />
        <AdminProvider>
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
              <Route path="/lab/subdomain-finder" element={<SubdomainFinder />} />
              <Route path="/lab/dns-finder" element={<DnsFinder />} />
              <Route path="/lab/crypto-tool" element={<CryptoTool />} />

              {/* Admin Panel */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="projects" element={<ProjectsManager />} />
                <Route path="services" element={<ServicesManager />} />
                <Route path="timeline" element={<TimelineManager />} />
                <Route path="about" element={<AboutManager />} />
                <Route path="contact" element={<ContactManager />} />
                <Route path="messages" element={<MessagesManager />} />
              </Route>
            </Routes>
          </Router>
        </AdminProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
