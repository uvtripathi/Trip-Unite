import React, { useEffect, useRef, useState } from "react";
import { FaPlaneDeparture } from "react-icons/fa";

function createMotionParams(width, height) {
  return {
    baseY: height * (0.2 + Math.random() * 0.55),
    ampA: 35 + Math.random() * 80,
    ampB: 12 + Math.random() * 30,
    freqA: 0.004 + Math.random() * 0.007,
    freqB: 0.009 + Math.random() * 0.014,
    phaseA: Math.random() * Math.PI * 2,
    phaseB: Math.random() * Math.PI * 2,
    speed: 0.9 + Math.random() * 1.7,
  };
}

function FlightPath() {
  const rafRef = useRef(null);
  const lastRef = useRef(0);
  const xRef = useRef(-80);
  const paramsRef = useRef(
    createMotionParams(window.innerWidth, window.innerHeight),
  );
  const [planeState, setPlaneState] = useState({ x: -80, y: 120, angle: 0 });
  const [trail, setTrail] = useState([]);

  useEffect(() => {
    const onResize = () => {
      paramsRef.current = createMotionParams(
        window.innerWidth,
        window.innerHeight,
      );
    };

    const animate = (time) => {
      const last = lastRef.current || time;
      const dt = Math.min(40, time - last);
      lastRef.current = time;

      const width = window.innerWidth;
      const height = window.innerHeight;
      const p = paramsRef.current;

      xRef.current += p.speed * (dt / 16);
      if (xRef.current > width + 90) {
        xRef.current = -80;
        paramsRef.current = createMotionParams(width, height);
      }

      const x = xRef.current;
      const y =
        p.baseY +
        p.ampA * Math.sin(x * p.freqA + p.phaseA) +
        p.ampB * Math.sin(x * p.freqB + p.phaseB);

      const aheadX = x + 10;
      const aheadY =
        p.baseY +
        p.ampA * Math.sin(aheadX * p.freqA + p.phaseA) +
        p.ampB * Math.sin(aheadX * p.freqB + p.phaseB);

      const angle = (Math.atan2(aheadY - y, 10) * 180) / Math.PI;

      setPlaneState({ x, y, angle });
      setTrail((prev) => {
        const next = [{ x, y, id: time }, ...prev].slice(0, 26);
        return next;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", onResize);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", onResize);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div className="flight-layer" aria-hidden="true">
      {trail.map((dot, index) => (
        <span
          key={dot.id}
          className="flight-dot"
          style={{
            left: `${dot.x}px`,
            top: `${dot.y}px`,
            opacity: Math.max(0, 0.9 - index * 0.035),
            transform: `scale(${Math.max(0.28, 1 - index * 0.03)})`,
          }}
        />
      ))}
      <div
        className="flight-plane"
        style={{
          left: `${planeState.x}px`,
          top: `${planeState.y}px`,
          transform: `translate(-50%, -50%) rotate(${planeState.angle}deg)`,
        }}
      >
        <FaPlaneDeparture />
      </div>
    </div>
  );
}

export default FlightPath;
