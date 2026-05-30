import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Contact.css";
import LanguageSelector from "./LanguageSelector";
import { useTranslation } from "react-i18next";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import BrandLogo from "./common/BrandLogo";
import ThemeToggle from "./common/ThemeToggle";

const QUOTES = [
  {
    text: "Alone we can do so little; together we can do so much.",
    author: "Helen Keller",
  },
  {
    text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
    author: "Dr. Seuss",
  },
  {
    text: "Knowledge shared is knowledge doubled. A single conversation with a wise person is worth a month's study of books.",
    author: "Chinese Proverb",
  },
  {
    text: "Travel is the only thing you buy that makes you richer — and every fellow traveller makes you wiser.",
    author: "Anonymous",
  },
  {
    text: "The human spirit is to grow strong by conflict.",
    author: "William Ellery Channing",
  },
  {
    text: "We travel not to escape life, but for life not to escape us. Every stranger met is a world unexplored.",
    author: "Anonymous",
  },
];

const INTERVAL = 60 * 1000; // 1 minute

function Contact() {
  const { t } = useTranslation();
  const location = useLocation();
  const [activeIdx, setActiveIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setActiveIdx((i) => (i + 1) % QUOTES.length);
        setVisible(true);
      }, 500);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, []);

  const goTo = (idx) => {
    setVisible(false);
    setTimeout(() => {
      setActiveIdx(idx);
      setVisible(true);
    }, 400);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    // Clear error for this field as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (successMsg) setSuccessMsg("");
  };

  const validate = () => {
    const newErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9]{10}$/;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailPattern.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!phonePattern.test(formData.phone.trim())) {
      newErrors.phone = "Please enter a valid 10-digit phone number.";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message is required.";
    }

    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setSuccessMsg("✅ Thanks! Your message has been sent successfully.");
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div className="contact-wrapper">
      <div className="contact-container">
        {/* ── Premium Frosted-Glass Navbar ── */}
        <nav className="contact-navbar">
          <Link to="/" style={{ textDecoration: "none" }}>
            <BrandLogo />
          </Link>

          <div className="contact-nav-pill">
            <Link to="/" style={{ textDecoration: "none" }}>
              <span
                className={`contact-nav-link ${location.pathname === "/" ? "contact-nav-active" : ""}`}
              >
                {t("home")}
              </span>
            </Link>
            <span className="contact-nav-lang">
              <LanguageSelector />
            </span>
            <Link to="/about" style={{ textDecoration: "none" }}>
              <span
                className={`contact-nav-link ${location.pathname === "/about" ? "contact-nav-active" : ""}`}
              >
                {t("about")}
              </span>
            </Link>
            <Link to="/contact" style={{ textDecoration: "none" }}>
              <span
                className={`contact-nav-link ${location.pathname === "/contact" ? "contact-nav-active" : ""}`}
              >
                {t("contactus")}
              </span>
            </Link>
            <span className="contact-nav-divider" aria-hidden="true" />
            <ThemeToggle />
          </div>
        </nav>

        <h1 className="contact-heading">{t("contactus")}</h1>
        <h3 className="contact-subheading">{t("Reachouttous")}</h3>

        {successMsg && (
          <div className="contact-success-msg">{successMsg}</div>
        )}

        <form className="contact-section" onSubmit={handleSubmit} noValidate>
          <div className="contact-left">
            <div className="contact-name">
              <p className="contact-text">{t("name")}</p>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`contact-input ${errors.name ? "contact-input-error" : ""}`}
                placeholder="Your full name"
              />
              {errors.name && (
                <span className="contact-field-error">{errors.name}</span>
              )}
            </div>
            <div className="contact-email">
              <p className="contact-text">{t("email")}</p>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`contact-input ${errors.email ? "contact-input-error" : ""}`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <span className="contact-field-error">{errors.email}</span>
              )}
            </div>
            <div className="contact-contact">
              <p className="contact-text">{t("Phonenumber")}</p>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`contact-input ${errors.phone ? "contact-input-error" : ""}`}
                placeholder="10-digit phone number"
              />
              {errors.phone && (
                <span className="contact-field-error">{errors.phone}</span>
              )}
            </div>
            <div className="contact-message">
              <p className="contact-text">{t("message")}</p>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className={`contact-input contact-textarea ${errors.message ? "contact-input-error" : ""}`}
                placeholder="Tell me what you need help with"
              />
              {errors.message && (
                <span className="contact-field-error">{errors.message}</span>
              )}
            </div>
            <button type="submit" className="contact-submit">
              {t("submit")}
            </button>
          </div>
          <div className="contact-right">
            <h2>{t("ContactInformation")}</h2>
            <div className="contact-information">
              <p>
                <span className="contact-link">GitHub: uvtripathi</span>
              </p>
              <p>
                <a href="mailto:22BET10140@cuchd.in" className="contact-link">
                  ✉️ 22BET10140@cuchd.in
                </a>
              </p>
            </div>
            <div className="contact-icons">
              <a
                href="https://github.com/uvtripathi"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="contact-icon-link"
              >
                <FaInstagram />
              </a>
              <a
                href="https://github.com/uvtripathi/Trip-Unite"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TripUnite repository"
                className="contact-icon-link"
              >
                <FaXTwitter />
              </a>
              <a
                href="https://github.com/uvtripathi"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Developer profile"
                className="contact-icon-link"
              >
                <FaLinkedin />
              </a>
            </div>
          </div>
        </form>

        {/* ── Rotating Quote ── */}
        <div className="contact-quotes">
          <p className="contact-quotes-label">💬 Why Connection Matters</p>

          <div
            className={`cq-card cq-single ${visible ? "cq-visible" : "cq-hidden"}`}
          >
            <span className="cq-mark">&ldquo;</span>
            <p className="cq-text">{QUOTES[activeIdx].text}</p>
            <span className="cq-author">— {QUOTES[activeIdx].author}</span>
          </div>

          {/* Dot indicators */}
          <div className="cq-dots">
            {QUOTES.map((_, i) => (
              <button
                key={i}
                className={`cq-dot ${i === activeIdx ? "cq-dot-active" : ""}`}
                onClick={() => goTo(i)}
                aria-label={`Quote ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
