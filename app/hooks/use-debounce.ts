"use client";

import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, duration: number = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    let timeoutId = setTimeout(() => setDebouncedValue(value), duration);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [value]);

  return debouncedValue;
}
