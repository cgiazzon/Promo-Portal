import { useEffect } from "react";
import { useLocation } from "wouter";

export default function FAQ() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation("/");
    setTimeout(() => {
      const el = document.getElementById("faq");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [setLocation]);

  return null;
}
