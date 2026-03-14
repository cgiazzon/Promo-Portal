import { useEffect } from "react";

export default function FAQ() {
  useEffect(() => {
    const base = import.meta.env.BASE_URL.replace(/\/$/, "") || "";
    window.location.replace(`${base}/#faq`);
  }, []);

  return null;
}
