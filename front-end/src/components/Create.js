import React, { useState } from "react";
import "./Create.css";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { getApiUrl } from "../util/api";
import BrandLogo from "./common/BrandLogo";
import ThemeToggle from "./common/ThemeToggle";

function Create() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Name: "",
    Destination: "",
    Description: "",
    StartDate: "",
    EndDate: "",
    estimatedBudget: "",
    TravellerCount: "",
    localGuide: false,
    MeetUPLocation: "",
    Gender: "",
    MinAge: "",
    MaxAge: "",
    Remark: "",
  });

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleRadioChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value === "true" }));
  }

  // Guard: redirect to login if not authenticated
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  if (isAuthenticated !== "true") {
    toast.error("Please log in to create a trip");
    navigate("/login");
    return null;
  }

  async function submithandler(e) {
    e.preventDefault();
    try {
      const travellerCount = formData.TravellerCount
        ? parseInt(formData.TravellerCount)
        : undefined;
      const minAge = parseInt(formData.MinAge);
      const maxAge = parseInt(formData.MaxAge);
      if (isNaN(minAge) || isNaN(maxAge)) {
        toast.error("Please enter valid Min and Max age");
        return;
      }
      await axios.post(
        getApiUrl("/api/auth/createTrips"),
        {
          ...formData,
          estimatedBudget: parseFloat(formData.estimatedBudget),
          TravellerCount: travellerCount,
          MinAge: minAge,
          MaxAge: maxAge,
        },
        { withCredentials: true },
      );
      toast.success("TRIP CREATED");
      navigate("/main");
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.msg ||
        "Error creating trip — check all fields and try again";
      toast.error(msg);
      console.error("Error creating trip:", error?.response?.data || error);
    }
  }

  return (
    <div className="create-wrapper">

      {/* ── Navbar ── */}
      <nav className="create-nav">
        <Link to="/" style={{ textDecoration: "none" }}>
          <BrandLogo />
        </Link>
        <div className="create-nav-pill">
          <LanguageSelector />
          <Link to="/" className="create-nav-link">{t("home")}</Link>
          <Link to="/about" className="create-nav-link">{t("about")}</Link>
          <Link to="/contact" className="create-nav-link">{t("contact")}</Link>
        </div>
        <div className="create-nav-right">
          <ThemeToggle />
        </div>
      </nav>

      {/* ── Main layout ── */}
      <div className="create-body">

        {/* LEFT decorative panel */}
        <aside className="create-left-panel">
          <div className="clp-badge">✈ Trip Creator</div>
          <h1 className="clp-headline">{t("tailored")}</h1>
          <p className="clp-sub">
            Set your destination, dates and preferences — the right co-travellers will find you.
          </p>

          <ul className="clp-features">
            <li><span className="clp-icon">🗺️</span> Choose any destination worldwide</li>
            <li><span className="clp-icon">👥</span> Filter by gender & age range</li>
            <li><span className="clp-icon">💰</span> Set a shared budget estimate</li>
            <li><span className="clp-icon">📍</span> Define a meetup location</li>
            <li><span className="clp-icon">🧭</span> Request a local guide</li>
          </ul>

          {/* decorative glow blob */}
          <div className="clp-glow" />
        </aside>

        {/* RIGHT form card */}
        <form className="create-card" onSubmit={submithandler}>
          <h2 className="create-card-title">{t("createtrip")}</h2>

          {/* Row 1: Name + Destination */}
          <div className="cf-row">
            <div className="cf-field">
              <label className="cf-label">{t("nameoftrip")}</label>
              <input className="cf-input" type="text" name="Name"
                value={formData.Name} onChange={handleInputChange} required
                placeholder="e.g. Goa Beach Vibes" />
            </div>
            <div className="cf-field">
              <label className="cf-label">{t("Destinationfoot")}</label>
              <input className="cf-input" type="text" name="Destination"
                value={formData.Destination} onChange={handleInputChange} required
                placeholder="e.g. Goa, India" />
            </div>
          </div>

          {/* Description */}
          <div className="cf-field">
            <label className="cf-label">{t("desc")}</label>
            <textarea className="cf-input cf-textarea" name="Description"
              value={formData.Description} onChange={handleInputChange} required
              placeholder="What's the vibe? Beaches, temples, trekking..." />
          </div>

          {/* Dates */}
          <div className="cf-row">
            <div className="cf-field">
              <label className="cf-label">{t("start")}</label>
              <input className="cf-input" type="date" name="StartDate"
                value={formData.StartDate} onChange={handleInputChange} required />
            </div>
            <div className="cf-field">
              <label className="cf-label">{t("end")}</label>
              <input className="cf-input" type="date" name="EndDate"
                value={formData.EndDate} onChange={handleInputChange} required />
            </div>
          </div>

          {/* Budget + MeetUp */}
          <div className="cf-row">
            <div className="cf-field">
              <label className="cf-label">{t("estimatedbudget")} (₹)</label>
              <input className="cf-input" type="number" name="estimatedBudget"
                value={formData.estimatedBudget} onChange={handleInputChange} required
                placeholder="e.g. 8000" />
            </div>
            <div className="cf-field">
              <label className="cf-label">{t("meetup")}</label>
              <input className="cf-input" type="text" name="MeetUPLocation"
                value={formData.MeetUPLocation} onChange={handleInputChange} required
                placeholder="e.g. New Delhi Station" />
            </div>
          </div>

          {/* Local guide radio */}
          <div className="cf-field">
            <label className="cf-label">{t("NeedaLocalGuide")}</label>
            <div className="cf-radio-group">
              <label className="cf-radio-label">
                <input type="radio" name="localGuide" value="true"
                  checked={formData.localGuide === true} onChange={handleRadioChange} />
                <span className="cf-radio-custom" />
                {t("yes")}
              </label>
              <label className="cf-radio-label">
                <input type="radio" name="localGuide" value="false"
                  checked={formData.localGuide === false} onChange={handleRadioChange} />
                <span className="cf-radio-custom" />
                {t("no")}
              </label>
            </div>
          </div>

          {/* Travellers */}
          <div className="cf-field">
            <label className="cf-label">{t("travellers")}</label>
            <input className="cf-input" type="number" name="TravellerCount"
              value={formData.TravellerCount} onChange={handleInputChange}
              placeholder="Max group size (optional)" />
          </div>

          {/* Gender preference */}
          <div className="cf-field">
            <label className="cf-label">{t("preference")}</label>
            <div className="cf-radio-group">
              <label className="cf-radio-label">
                <input type="radio" id="female" name="Gender" value="female"
                  checked={formData.Gender === "female"} onChange={handleInputChange} />
                <span className="cf-radio-custom" />
                {t("onlyfemale")}
              </label>
              <label className="cf-radio-label">
                <input type="radio" id="male" name="Gender" value="male"
                  checked={formData.Gender === "male"} onChange={handleInputChange} />
                <span className="cf-radio-custom" />
                {t("onlymale")}
              </label>
              <label className="cf-radio-label">
                <input type="radio" id="none" name="Gender" value="None"
                  checked={formData.Gender === "None"} onChange={handleInputChange} />
                <span className="cf-radio-custom" />
                {t("nopreference")}
              </label>
            </div>
          </div>

          {/* Age range */}
          <div className="cf-field">
            <label className="cf-label">{t("agerange")}</label>
            <div className="cf-row" style={{ marginBottom: 0 }}>
              <input className="cf-input" type="number" name="MinAge"
                placeholder={t("min")} value={formData.MinAge}
                onChange={handleInputChange} required />
              <input className="cf-input" type="number" name="MaxAge"
                placeholder={t("max")} value={formData.MaxAge}
                onChange={handleInputChange} required />
            </div>
          </div>

          {/* Remarks */}
          <div className="cf-field">
            <label className="cf-label">{t("remarks")} <span style={{opacity:0.5}}>(optional)</span></label>
            <input className="cf-input" type="text" name="Remark"
              value={formData.Remark} onChange={handleInputChange}
              placeholder="Any rules, preferences or notes..." />
          </div>

          <button type="submit" className="cf-submit">
            🚀 {t("create")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Create;
