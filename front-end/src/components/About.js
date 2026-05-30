import React from "react";
import "./About.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";
import BrandLogo from "./common/BrandLogo";
import { FaRobot } from "react-icons/fa";
import ThemeToggle from "./common/ThemeToggle";
import {
  SiFigma,
  SiNodedotjs,
  SiReact,
  SiSupabase,
  SiVercel,
} from "react-icons/si";

/* ── Icons ── */
const IconLinkedIn = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
const IconGitHub = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);
const IconMail = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

/* 🖼️ Photo is imported at the top of this file */

function About() {
  const { t } = useTranslation();

  const skills = [
    {
      Icon: SiReact,
      color: "#61DAFB",
      name: "React.js",
      desc: "Building fast, reactive UIs with modern hooks.",
    },
    {
      Icon: SiNodedotjs,
      color: "#339933",
      name: "Node.js",
      desc: "Scalable server-side JavaScript with Express.",
    },
    {
      Icon: SiSupabase,
      color: "#3ECF8E",
      name: "Supabase",
      desc: "Postgres-powered backend with real-time support.",
    },
    {
      Icon: SiFigma,
      color: "#F24E1E",
      name: "UI/UX Design",
      desc: "Clean, user-centric interface design.",
    },
    {
      Icon: FaRobot,
      color: "#A78BFA",
      name: "AI Integration",
      desc: "Gemini API for intelligent trip planning.",
    },
    {
      Icon: SiVercel,
      color: "#FFFFFF",
      name: "Vercel Deploy",
      desc: "Seamless deployment and CI/CD pipelines.",
    },
  ];

  return (
    <div className="about-wrapper">
      {/* ── Navigation ── */}
      <nav className="about-nav">
        <Link to="/" style={{ textDecoration: "none" }}>
          <BrandLogo />
        </Link>
        <ul className="about-nav-links">
          <li>
            <Link to="/">{t("home")}</Link>
          </li>
          <li>
            <LanguageSelector />
          </li>
          <li>
            <Link to="/contact">{t("contact")}</Link>
          </li>
          <li className="about-nav-divider-wrap">
            <span className="about-nav-divider" aria-hidden="true" />
            <ThemeToggle />
          </li>
        </ul>
      </nav>

      {/* ── Hero ── */}
      <section className="about-hero">
        <div className="about-hero-inner">
          {/* Photo */}
          <div className="about-photo-wrap">
            <div className="about-photo-ring" />
            <div
              aria-label="Creator of TripUnite"
              className="about-photo-avatar about-photo-placeholder"
            >
              YT
            </div>
            <span className="about-badge">✈️ Creator of TripUnite</span>
          </div>

          {/* Text */}
          <div className="about-hero-text">
            <div className="about-greeting">
              <span>👋</span> Hey there!
            </div>

            <h1 className="about-name">Yuvraj Tripathi</h1>

            {/* ── 🖊️ CHANGE YOUR ROLE BELOW ── */}
            <p className="about-role">
              Full-Stack Developer &amp; Travel Enthusiast
            </p>

            <p className="about-bio">
              I'm the creator and sole developer behind{" "}
              <strong>TripUnite</strong> — a platform built to help travellers
              find companions, plan adventures, and explore the world together.
              Passionate about building products that make a real difference in
              how people experience travel.
            </p>

            <div className="about-socials">
              {/* ── 🖊️ REPLACE # WITH YOUR ACTUAL LINKS ── */}
              <Link to="/showcase" className="about-social-link showcase">
                View Showcase
              </Link>
              <a href="/contact" className="about-social-link linkedin">
                <IconLinkedIn /> Contact
              </a>
              <a
                href="https://github.com/uvtripathi"
                target="_blank"
                rel="noopener noreferrer"
                className="about-social-link github"
              >
                <IconGitHub /> GitHub
              </a>
              <a
                href="mailto:22BET10140@cuchd.in"
                className="about-social-link email"
              >
                <IconMail /> Email Me
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <div className="about-stats-strip">
        <div className="about-stat">
          <div className="about-stat-num">1</div>
          <div className="about-stat-label">Solo Developer</div>
        </div>
        <div className="about-stat">
          <div className="about-stat-num">6+</div>
          <div className="about-stat-label">Core Features</div>
        </div>
        <div className="about-stat">
          <div className="about-stat-num">AI</div>
          <div className="about-stat-label">Powered Planning</div>
        </div>
        <div className="about-stat">
          <div className="about-stat-num">∞</div>
          <div className="about-stat-label">Trips to Explore</div>
        </div>
      </div>

      {/* ── Skills Grid ── */}
      <section className="about-skills-section">
        <p className="about-section-label">What I built with</p>
        <h2 className="about-section-title">Tech Stack</h2>
        <p className="about-section-sub">
          TripUnite is a full-stack application designed for scale, speed, and
          great user experience.
        </p>
        <div className="about-skills-grid">
          {skills.map((s) => (
            <div className="about-skill-card" key={s.name}>
              <span className="about-skill-icon" style={{ color: s.color }}>
                <s.Icon aria-hidden="true" />
              </span>
              <div className="about-skill-name">{s.name}</div>
              <div className="about-skill-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="about-mission-section">
        <p className="about-section-label">Why I built this</p>
        <h2 className="about-section-title">The Vision</h2>
        <div className="about-mission-card">
          <p className="about-mission-text">
            Travel is better when shared. <strong>TripUnite</strong> was created
            to solve the real problem of solo travellers who want to find
            trustworthy companions on the road. By combining AI-powered trip
            planning, smart matching, and a clean community-first platform, my
            goal is to make{" "}
            <strong>every journey feel less alone and more memorable</strong>.
          </p>
        </div>
      </section>
    </div>
  );
}

export default About;
