"use client";

import { useEffect } from "react";

export default function ClearAuthCookies() {
  useEffect(() => {
    // Clear any invalid auth cookies on mount
    if (typeof document !== "undefined") {
      const cookies = document.cookie.split(";");
      cookies.forEach((cookie) => {
        const cookieName = cookie.split("=")[0].trim();
        if (
          cookieName.includes("authjs") ||
          cookieName.includes("next-auth")
        ) {
          // Check if cookie value is invalid
          const cookieValue = cookie.split("=")[1];
          if (cookieValue && cookieValue.includes("undefined")) {
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          }
        }
      });
    }
  }, []);

  return null;
}
