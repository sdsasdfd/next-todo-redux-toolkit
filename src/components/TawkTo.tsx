// components/TawkTo.js
'use client'
import { useEffect } from "react";

const TawkTo = () => {
  useEffect(() => {
    var s1 = document.createElement("script");
    s1.async = true;
    s1.src = "https://embed.tawk.to/68b808fe721af15d8752e381/1j47e68t7";
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");
    document.body.appendChild(s1);
  }, []);

  return null;
};

export default TawkTo;
