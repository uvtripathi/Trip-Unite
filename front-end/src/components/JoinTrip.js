import React, { useContext, useEffect, useState } from "react";
import "./JoinTrip.css";
import { Link, useNavigate } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";
import { useTranslation } from "react-i18next";
import { UserContext } from "../context/userContext";
import images from "../image";
import axios from "axios";
import { toast } from "react-toastify";
import { getApiUrl } from "../util/api";
import BrandLogo from "./common/BrandLogo";
import ThemeToggle from "./common/ThemeToggle";

function JoinTrip() {
  const { t } = useTranslation();
  const { currentTrip } = useContext(UserContext);
  const [trip, setTrip] = useState(null);
  const navigate = useNavigate();
  const [userData, setData] = useState({ Name: "", Age: "", Gender: "", Contact: "" });
  const [img, setImg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  }

  async function submithandler(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(
        getApiUrl(`/api/auth/joinTrips/${currentTrip}`),
        { ...userData, Age: parseInt(userData.Age) },
        { withCredentials: true },
      );
      toast.success("🎉 Trip request sent! Awaiting leader approval.");
      navigate("/main");
    } catch (error) {
      const msg = error?.response?.data?.message || "Error joining trip";
      toast.error(msg);
      console.error("Error joining trip:", error?.response?.data || error);
    } finally {
      setSubmitting(false);
    }
  }

  async function fetchTrip() {
    if (!currentTrip) return;
    try {
      const res = await fetch(getApiUrl(`/api/auth/trips/${currentTrip}`));
      if (!res.ok) throw new Error("Failed to fetch trip");
      const data = await res.json();
      setTrip(data.trip);
    } catch (err) {
      console.error("Fetch trip error:", err);
    }
  }

  useEffect(() => {
    fetchTrip();
    const rnd = Math.floor(Math.random() * 9);
    if (images[rnd]) setImg(images[rnd].url);
  }, [currentTrip]);

  /* Format date: 2026-04-27 → 27/04/2026 */
  const fmtDate = (d) =>
    d ? d.substr(0, 10).split("-").reverse().join("/") : "—";

  if (!trip) {
    return (
      <div className="jt-loading">
        <div className="jt-spinner" />
        <p>Loading trip details…</p>
      </div>
    );
  }

  return (
    <div className="jt-wrapper">

      {/* ── Navbar ── */}
      <nav className="jt-nav">
        <Link to="/" style={{ textDecoration: "none" }}>
          <BrandLogo />
        </Link>
        <div className="jt-nav-pill">
          <LanguageSelector />
          <Link to="/"       className="jt-nav-link">{t("home")}</Link>
          <Link to="/about"  className="jt-nav-link">{t("about")}</Link>
          <Link to="/contact" className="jt-nav-link">{t("contactus")}</Link>
        </div>
        <div className="jt-nav-right">
          <ThemeToggle />
        </div>
      </nav>

      {/* ── Body ── */}
      <div className="jt-body">

        {/* ── LEFT: trip details ── */}
        <div className="jt-left">

          {/* hero image + title overlay */}
          <div className="jt-hero-img" style={{ backgroundImage: `url(${img})` }}>
            <div className="jt-hero-overlay" />
            <div className="jt-hero-tag">
              {trip.Gender === "female" ? "👩 Female Only"
                : trip.Gender === "male" ? "👨 Male Only"
                : "🌍 All Genders"}
            </div>
            <h1 className="jt-destination">{trip.Destination}</h1>
          </div>

          {/* Description */}
          <p className="jt-description">{trip.Description}</p>

          {/* Info chips grid */}
          <div className="jt-info-grid">
            <div className="jt-chip">
              <span className="jt-chip-label">📅 Dates</span>
              <span className="jt-chip-value">
                {fmtDate(trip.StartDate)} → {fmtDate(trip.EndDate)}
              </span>
            </div>
            <div className="jt-chip">
              <span className="jt-chip-label">💰 Budget (est.)</span>
              <span className="jt-chip-value jt-budget">₹{Number(trip.estimatedBudget).toLocaleString()}</span>
            </div>
            <div className="jt-chip">
              <span className="jt-chip-label">📍 Meet Up</span>
              <span className="jt-chip-value">{trip.MeetUPLocation}</span>
            </div>
            <div className="jt-chip">
              <span className="jt-chip-label">🧭 Local Guide</span>
              <span className={`jt-chip-value ${trip.localGuide ? "jt-yes" : "jt-no"}`}>
                {trip.localGuide ? t("yes") : t("no")}
              </span>
            </div>
            <div className="jt-chip">
              <span className="jt-chip-label">👥 Group Size</span>
              <span className="jt-chip-value">{trip.TravellerCount || "Open"} travellers</span>
            </div>
            <div className="jt-chip">
              <span className="jt-chip-label">🎂 Age Range</span>
              <span className="jt-chip-value">{trip.MinAge} – {trip.MaxAge} yrs</span>
            </div>
            {trip.Remark && (
              <div className="jt-chip jt-chip-full">
                <span className="jt-chip-label">📝 Remarks</span>
                <span className="jt-chip-value">{trip.Remark}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: join form ── */}
        <div className="jt-right">
          <div className="jt-form-card">
            <h2 className="jt-form-title">Join This Trip</h2>
            <p className="jt-form-sub">Fill in your details — the trip leader will review your request.</p>

            <form onSubmit={submithandler} className="jt-form">
              <div className="jt-field">
                <label className="jt-label">{t("name")}</label>
                <input className="jt-input" type="text" name="Name"
                  value={userData.Name} onChange={handleInputChange}
                  placeholder="Your full name" required />
              </div>

              <div className="jt-field">
                <label className="jt-label">{t("age")}</label>
                <input className="jt-input" type="number" name="Age"
                  value={userData.Age} onChange={handleInputChange}
                  placeholder="Your age" required min="10" max="99" />
              </div>

              <div className="jt-field">
                <label className="jt-label">{t("gender")}</label>
                <div className="jt-radio-group">
                  {[
                    { val: "Female", label: t("female"), icon: "👩" },
                    { val: "Male",   label: t("male"),   icon: "👨" },
                    { val: "Other",  label: t("other"),  icon: "🌍" },
                  ].map(({ val, label, icon }) => (
                    <label key={val} className={`jt-radio-pill ${userData.Gender === val ? "active" : ""}`}>
                      <input type="radio" name="Gender" value={val}
                        checked={userData.Gender === val}
                        onChange={handleInputChange} />
                      {icon} {label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="jt-field">
                <label className="jt-label">{t("contact")}</label>
                <input className="jt-input" type="number" name="Contact"
                  value={userData.Contact} onChange={handleInputChange}
                  placeholder="10-digit mobile number" required />
              </div>

              {/* Budget display */}
              <div className="jt-budget-chip">
                <span>💰 Estimated budget per person</span>
                <span className="jt-budget-amt">₹{Number(trip.estimatedBudget).toLocaleString()}</span>
              </div>

              <button type="submit" className="jt-submit-btn" disabled={submitting}>
                {submitting ? "Sending…" : `🚀 ${t("join")}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JoinTrip;
