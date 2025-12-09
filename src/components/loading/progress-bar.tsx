"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";

export function ProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    NProgress.configure({
      showSpinner: false,
      trickleSpeed: 50,
      minimum: 0.1,
      speed: 200,
    });
  }, []);

  useEffect(() => {
    // Start progress bar when navigation begins
    if (isNavigating) {
      NProgress.start();
    }

    // Complete progress bar when page loads
    const timer = setTimeout(() => {
      NProgress.done();
      setIsNavigating(false);
    }, 100);

    return () => {
      clearTimeout(timer);
      setIsNavigating(true);
    };
  }, [pathname, searchParams]);

  return null;
}
