import React from "react";
import "./Footer.css";
import { BsTwitterX } from "react-icons/bs";
import { FaInstagram } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import BrandLogo from "./common/BrandLogo";

function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="Footer">
      <div className="footer-inner">

        {/* ── Brand column ── */}
        <div className="footer-brand">
          <Link to="/" style={{ textDecoration: "none" }}>
            <BrandLogo />
          </Link>
          <p className="footer-tagline">{t("discoverwith")}</p>
          <div className="footer-social">
            <a href="https://github.com/uvtripathi" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" className="footer-icon"><FaInstagram /></a>
            <a href="https://github.com/uvtripathi/Trip-Unite" target="_blank" rel="noopener noreferrer" aria-label="TripUnite repository" className="footer-icon"><BsTwitterX /></a>
            <a href="https://github.com/uvtripathi" target="_blank" rel="noopener noreferrer" aria-label="Developer profile" className="footer-icon"><FaLinkedin /></a>
          </div>
        </div>

        {/* ── Help column ── */}
        <div className="footer-col">
          <h4 className="footer-col-title">{t("help")}</h4>
          <ul className="footer-links">
            <li><Link to="/contact">FAQs</Link></li>
            <li><Link to="/contact">{t("contactus")}</Link></li>
            <li><Link to="/contact">{t("getassistance")}</Link></li>
          </ul>
        </div>

        {/* ── More column ── */}
        <div className="footer-col">
          <h4 className="footer-col-title">{t("more")}</h4>
          <ul className="footer-links">
            <li><Link to="/about">{t("about")}</Link></li>
            <li><Link to="/main">{t("Destinationfoot")}</Link></li>
            <li><Link to="/main">{t("tripsfoot")}</Link></li>
          </ul>
        </div>

        {/* ── Contact column ── */}
        <div className="footer-col">
          <h4 className="footer-col-title">{t("contactus")}</h4>
          <ul className="footer-links">
            <li><a href="mailto:22BET10140@cuchd.in">22BET10140@cuchd.in</a></li>
            <li><a href="https://github.com/uvtripathi">github.com/uvtripathi</a></li>
          </ul>
        </div>

      </div>

      {/* ── Bottom bar ── */}
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} TripUnite. All rights reserved.</span>
        <span className="footer-bottom-links">
          <Link to="/contact">Privacy Policy</Link>
          <Link to="/contact">Terms of Service</Link>
        </span>
      </div>
    </footer>
  );
}

export default Footer;
