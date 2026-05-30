import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./LanguageSelector.css";

const LANGUAGES = [
  { code: "en",  label: "English", flag: "🇺🇸", short: "EN" },
  { code: "हिं", label: "हिंदी",   flag: "🇮🇳", short: "HI" },
];

function LanguageSelector() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const current =
    LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  function changeLanguage(code) {
    localStorage.setItem("lang", code);
    i18n.changeLanguage(code);
    setOpen(false);
  }

  return (
    <div className="ls-wrapper" ref={ref}>
      {/* Trigger button */}
      <button
        className="ls-trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select language"
      >
        <span className="ls-flag">{current.flag}</span>
        <span className="ls-short">{current.short}</span>
        <svg
          className={`ls-chevron ${open ? "ls-chevron-open" : ""}`}
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M2 3.5L5 6.5L8 3.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="ls-dropdown" role="listbox" aria-label="Languages">
          {LANGUAGES.map((lng) => (
            <button
              key={lng.code}
              role="option"
              aria-selected={lng.code === i18n.language}
              className={`ls-option ${lng.code === i18n.language ? "ls-option-active" : ""}`}
              onClick={() => changeLanguage(lng.code)}
            >
              <span className="ls-option-flag">{lng.flag}</span>
              <span className="ls-option-label">{lng.label}</span>
              {lng.code === i18n.language && (
                <svg
                  className="ls-check"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2.5 7L5.5 10L11.5 4"
                    stroke="#a78bfa"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSelector;
