import React from "react";
import "./Showcase.css";
import { Link } from "react-router-dom";
import BrandLogo from "./common/BrandLogo";
import ThemeToggle from "./common/ThemeToggle";
import {
  FaUsers,
  FaRobot,
  FaShieldHeart,
  FaRoute,
  FaComments,
  FaCloud,
  FaStar,
} from "react-icons/fa6";

const features = [
  {
    Icon: FaUsers,
    title: "Smart Travel Matching",
    text: "Helps solo travelers find compatible companions based on destination, timing, and travel style.",
  },
  {
    Icon: FaRobot,
    title: "AI Trip Planning",
    text: "Uses AI assistance to suggest ideas, organize journeys, and reduce planning friction.",
  },
  {
    Icon: FaShieldHeart,
    title: "Community-First Design",
    text: "Focuses on trust, clarity, and a calm user experience that feels safe to use.",
  },
  {
    Icon: FaRoute,
    title: "End-to-End Journey Flow",
    text: "Covers discovery, trip creation, joining, and follow-up from one flow.",
  },
  {
    Icon: FaComments,
    title: "Direct Communication",
    text: "Keeps collaboration simple so travelers can coordinate plans without friction.",
  },
  {
    Icon: FaCloud,
    title: "Modern Deployment Stack",
    text: "Built to work smoothly with a modern frontend, backend, and cloud-ready deployment setup.",
  },
];

const testimonials = [
  {
    portrait:
      "https://image.pollinations.ai/prompt/professional%20travel%20reviewer%20portrait%20studio%20lighting%20natural%20smile%20dark%20background%20high%20detail?width=640&height=640&nologo=true",
    name: "Sample testimonial",
    role: "Product reviewer",
    quote:
      "TripUnite stands out because it combines practical trip coordination with a polished interface that feels ready for real users.",
  },
  {
    portrait:
      "https://image.pollinations.ai/prompt/young%20travel%20creator%20portrait%20studio%20lighting%20warm%20tones%20realistic%20face%20high%20detail?width=640&height=640&nologo=true",
    name: "Sample testimonial",
    role: "Early beta feedback",
    quote:
      "The experience is focused and useful. It solves a clear travel problem while keeping the app easy to navigate.",
  },
  {
    portrait:
      "https://image.pollinations.ai/prompt/confident%20product%20designer%20portrait%20studio%20lighting%20realistic%20headshot%20high%20detail%20soft%20gradient%20background?width=640&height=640&nologo=true",
    name: "Sample testimonial",
    role: "Portfolio feedback draft",
    quote:
      "This project shows strong full-stack thinking, a clean design direction, and a product concept with obvious real-world value.",
  },
];

function Showcase() {
  return (
    <div className="showcase-page">
      <nav className="showcase-nav">
        <Link to="/" style={{ textDecoration: "none" }}>
          <BrandLogo />
        </Link>
        <div className="showcase-nav-links">
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <span className="showcase-nav-divider" aria-hidden="true" />
          <ThemeToggle />
        </div>
      </nav>

      <main className="showcase-main">
        <section className="showcase-hero">
          <p className="showcase-kicker">TripUnite Showcase</p>
          <h1>
            Features that make TripUnite feel complete, useful, and polished.
          </h1>
          <p className="showcase-subtitle">
            This page is designed as a public-facing overview of the product
            strengths, major features, and presentation-ready feedback. The
            testimonials below are sample presentation copy and should be
            replaced with approved quotes before publishing as real
            endorsements.
          </p>
          <div className="showcase-actions">
            <Link to="/contact" className="showcase-primary-btn">
              Contact Me for Work
            </Link>
            <Link to="/about" className="showcase-secondary-btn">
              Back to About
            </Link>
          </div>
        </section>

        <section className="showcase-section">
          <div className="showcase-section-heading">
            <p className="showcase-label">What TripUnite does well</p>
            <h2>Feature highlights</h2>
          </div>
          <div className="showcase-grid">
            {features.map((feature) => (
              <article className="showcase-card" key={feature.title}>
                <span className="showcase-icon">
                  <feature.Icon aria-hidden="true" />
                </span>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="showcase-section">
          <div className="showcase-section-heading">
            <p className="showcase-label">Presentation copy</p>
            <h2>Sample testimonials</h2>
          </div>
          <div className="showcase-testimonials">
            {testimonials.map((testimonial) => (
              <article className="testimonial-card" key={testimonial.quote}>
                <div className="testimonial-head">
                  <img
                    className="testimonial-avatar"
                    src={testimonial.portrait}
                    alt="AI generated presentation portrait"
                    loading="lazy"
                  />
                  <div className="testimonial-badge-wrap">
                    <FaStar className="testimonial-star" aria-hidden="true" />
                    <span className="testimonial-badge">
                      Presentation portrait
                    </span>
                  </div>
                </div>
                <p className="testimonial-quote">“{testimonial.quote}”</p>
                <div className="testimonial-meta">
                  <strong>{testimonial.name}</strong>
                  <span>{testimonial.role}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Showcase;
