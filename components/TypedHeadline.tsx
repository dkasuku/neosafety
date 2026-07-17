"use client";
import { useEffect, useState } from "react";

const phrases = [
  "Your safety, Our responsibility.",
  "PPE, Workwear & Uniforms.",
  "Branded Gear for Every Crew.",
  "Delivering Safety Across Kenya.",
];

export default function TypedHeadline() {
  const [i, setI] = useState(0);
  const [txt, setTxt] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const full = phrases[i % phrases.length];
    let t: ReturnType<typeof setTimeout>;
    if (!deleting && txt.length < full.length) {
      t = setTimeout(() => setTxt(full.slice(0, txt.length + 1)), 65);
    } else if (!deleting && txt.length === full.length) {
      t = setTimeout(() => setDeleting(true), 1700);
    } else if (deleting && txt.length > 0) {
      t = setTimeout(() => setTxt(full.slice(0, txt.length - 1)), 35);
    } else {
      setDeleting(false);
      setI((v) => v + 1);
      t = setTimeout(() => {}, 200);
    }
    return () => clearTimeout(t);
  }, [txt, deleting, i]);

  return (
    <span aria-live="polite">
      <span className="text-navy">{txt}</span>
      <span className="ml-0.5 inline-block w-[3px] animate-blink bg-green align-[-0.05em]" style={{ height: "0.9em" }} />
    </span>
  );
}
