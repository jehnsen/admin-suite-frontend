"use client";

import { useEffect, useState } from "react";

export function PageLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial load
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <div className="text-center space-y-4">
        {/* Logo/Brand */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary text-white font-bold text-2xl shadow-lg">
            AS
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary">AdminSuite</h1>
            <p className="text-sm text-muted-foreground">DepEd Management</p>
          </div>
        </div>

        {/* Loading Spinner */}
        <div className="relative">
          <div className="w-16 h-16 mx-auto">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600 animate-pulse">
            Loading...
          </p>
          <div className="flex items-center justify-center gap-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
