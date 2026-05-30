import React, { useState, useEffect } from "react";
import "./Page1.css";

import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getApiUrl } from "../util/api";
import BrandLogo from "./common/BrandLogo";
import FlightPath from "./animations/FlightPath";
import ThemeToggle from "./common/ThemeToggle";

function Page1() {
  const [userName, setUsername] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loggedInUser, setLoggedInUser] = useState(false);

  useEffect(() => {
    const storedLocalData = localStorage.getItem("userData");
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated === "true" && storedLocalData) {
      const userData = JSON.parse(storedLocalData);
      setLoggedInUser(true);
      setUsername(userData.user.fullName);
    }

    // Scroll event listener for navbar background
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogOut = async () => {
    try {
      setLoggedInUser(null);
      localStorage.clear(); // Always clear local state immediately
      await axios.post(
        getApiUrl("/api/auth/logout"),
        {},
        { withCredentials: true },
      );
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      // If the backend says 401, they are already logged out on the backend anyway
      toast.success("Logged out successfully"); 
      navigate("/login");
    }
  };

  const handleExplore = () => {
    navigate("/main");
  };

  return (
    <div className="page">

      {/* ── Premium Navbar ── */}
      <nav className={`navbar1 ${scrolled ? "scrolled" : ""}`}>
        {/* LEFT: Logo */}
        <Link to="/" style={{ textDecoration: "none" }}>
          <BrandLogo />
        </Link>

        {/* CENTER: Nav links pill */}
        <div className="navbar-items">
          <LanguageSelector />
          <Link to="/about" className="nav-link">{t("about")}</Link>
          <Link to="/contact" className="nav-link">{t("contact")}</Link>
        </div>

        {/* RIGHT: Auth + Theme toggle */}
        <div className="navbar-right">
          {loggedInUser ? (
            <>
              <span className="welcome-text">👤 {userName}</span>
              <Link to="/dashboard">
                <button className="btn-primary">{t("Dashboard")}</button>
              </Link>
              <button className="btn-danger" onClick={handleLogOut}>{t("logout")}</button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="btn-primary">{t("login")}</button>
              </Link>
              <Link to="/signup">
                <button className="btn-secondary">{t("signup")}</button>
              </Link>
            </>
          )}
          <div className="nav-divider" />
          <ThemeToggle />
        </div>
      </nav>

      <FlightPath />

      <div className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-subtitle-top">Explore the World</div>
          <h1 className="hero-title">Discover Amazing Destinations</h1>
          <p className="hero-subtitle">
            Join group tours and make unforgettable memories with travelers from
            around the world
          </p>

          <div className="hero-search">
            <input
              type="text"
              placeholder={t("search")}
              className="search-input"
            />
            <button className="btn-search" onClick={handleExplore}>
              🔍 Search
            </button>
          </div>

          <button className="btn-explore" onClick={handleExplore}>
            ✈️ Explore Trips
          </button>
        </div>
      </div>

      {/* Content Below Hero */}
      <section className="content-section">
        <h2>Why Choose TripUnite?</h2>
        <p>
          TripUnite is a place where travelers can chart their own course, where
          stories unfold in unexpected places and discovery happens one
          adventure at a time.
        </p>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <h3>Global Destinations</h3>
            <p>Explore destinations worldwide with experienced guides</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Meet Fellow Travelers</h3>
            <p>Connect with like-minded adventurers from around the globe</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎒</div>
            <h3>Curated Experiences</h3>
            <p>Handpicked trips that create lasting memories</p>
          </div>
        </div>
      </section>

      <ToastContainer />
    </div>
  );
}

export default Page1;
