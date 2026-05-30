import React, { useState } from "react";
import "./Feedback.css";
import { IoStarSharp } from "react-icons/io5";
import { useTranslation } from "react-i18next";

function Feedback() {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);

  // Form state
  const [fbName, setFbName] = useState("");
  const [fbEmail, setFbEmail] = useState("");
  const [fbMessage, setFbMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  const handleRatingSelect = (selectedRating) => {
    setRating(selectedRating);
    if (errors.rating) setErrors((prev) => ({ ...prev, rating: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!fbName.trim()) newErrors.name = "Name is required.";
    if (!fbEmail.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fbEmail.trim())) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!fbMessage.trim()) newErrors.message = "Message is required.";
    if (rating === 0) newErrors.rating = "Please select a rating.";
    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setSuccessMsg("✅ Thank you for your feedback!");
    setFbName("");
    setFbEmail("");
    setFbMessage("");
    setRating(0);
    setHovered(0);
  };

  const clearError = (field) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    if (successMsg) setSuccessMsg("");
  };

  return (
    <section className="feedback-page" id="page_3">
      <div className="container3">
        {/* ── LEFT: reviews ── */}
        <div className="left_side2">
          <div className="fb-badge">⭐ Community Reviews</div>
          <h1 className="heading3">{t("valuablefeedback")}</h1>
          <p>{t("reviewsandrating")}</p>

          <div className="rating">
            {/* Review 1 */}
            <div className="rating1">
              <div className="reviewer-row">
                <div className="reviewer-avatar">JS</div>
                <p className="name">{t("joy")}</p>
              </div>
              <div className="stars">
                <IoStarSharp className="color" />
                <IoStarSharp className="color" />
                <IoStarSharp className="color" />
                <IoStarSharp className="color" />
                <IoStarSharp className="color" />
              </div>
              <p className="feedback">{t("joyreview")}</p>
            </div>

            {/* Review 2 */}
            <div className="rating1">
              <div className="reviewer-row">
                <div className="reviewer-avatar">SN</div>
                <p className="name">{t("sneha")}</p>
              </div>
              <div className="stars">
                <IoStarSharp className="color" />
                <IoStarSharp className="color" />
                <IoStarSharp className="color" />
                <IoStarSharp className="color" />
                <IoStarSharp className="star-empty" />
              </div>
              <p className="feedback">{t("joyreview")}</p>
            </div>
          </div>
        </div>

        {/* ── RIGHT: form ── */}
        <div className="right_side">
          <div className="form">
            <h1>{t("feedbacktitle")}</h1>

            {successMsg && (
              <div className="fb-success-msg">{successMsg}</div>
            )}

            <div className="fb-field">
              <input
                type="text"
                placeholder={t("name")}
                id="fb-name"
                value={fbName}
                onChange={(e) => { setFbName(e.target.value); clearError("name"); }}
                className={errors.name ? "fb-input-error" : ""}
              />
              {errors.name && <span className="fb-field-error">{errors.name}</span>}
            </div>

            <div className="fb-field">
              <input
                type="email"
                placeholder={t("email")}
                id="fb-email"
                value={fbEmail}
                onChange={(e) => { setFbEmail(e.target.value); clearError("email"); }}
                className={errors.email ? "fb-input-error" : ""}
              />
              {errors.email && <span className="fb-field-error">{errors.email}</span>}
            </div>

            <div className="fb-field">
              <textarea
                placeholder={t("message")}
                id="Message"
                value={fbMessage}
                onChange={(e) => { setFbMessage(e.target.value); clearError("message"); }}
                className={errors.message ? "fb-input-error" : ""}
              />
              {errors.message && <span className="fb-field-error">{errors.message}</span>}
            </div>

            <div className="rate">
              <span>{t("Rate")} :</span>
              <span className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star-button ${star <= (hovered || rating) ? "selected" : ""}`}
                    onClick={() => handleRatingSelect(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                  >
                    <IoStarSharp />
                  </button>
                ))}
              </span>
            </div>
            {errors.rating && <span className="fb-field-error">{errors.rating}</span>}

            <button type="button" className="Submit" onClick={handleSubmit}>
              {t("Submit")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Feedback;
