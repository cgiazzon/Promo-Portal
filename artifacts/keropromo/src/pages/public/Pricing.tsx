import { useEffect } from "react";

export default function Pricing() {
  useEffect(() => {
    const base = import.meta.env.BASE_URL.replace(/\/$/, "") || "";
    window.location.replace(`${base}/#planos`);
  }, []);

  return null;
}
